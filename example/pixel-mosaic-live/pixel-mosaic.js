/*
 * Pixel Mosaic v1.3.4
 * Progressive pixel-mosaic reveal for still and animated web images.
 * No dependencies. Keeps the semantic <img> element intact.
 */
(function (global) {
  'use strict';

  const VERSION = '1.3.4';
  const KB = 1024;
  const MB = 1024 * KB;

  const DEFAULTS = Object.freeze({
    selector: 'img[data-pixel-mosaic]',
    autoDetect: false,
    autoSelector: 'main img:not([data-no-pixel-mosaic])',
    exclude: '[data-no-pixel-mosaic], [aria-hidden="true"]',
    minWidth: 96,
    minHeight: 64,
    duration: 1250,
    startDelay: 100,
    stepDuration: 0,
    steps: 'auto',
    stepCount: 8,
    easing: 'easeOutCubic',
    fadePortion: 0,
    startOn: 'visible',
    threshold: 0.04,
    rootMargin: '180px 0px',
    maxConcurrent: 3,
    renderFps: 'auto',
    maxDpr: 2,
    quality: 'auto',
    zIndex: 2147483000,
    respectReducedMotion: true,
    replayOnSourceChange: false,
    animationDetection: 'auto', // auto | attribute | off
    animatedMode: 'auto', // auto | decode | preserve
    animatedFetchTimeout: 2500,
    animatedMaxBytes: 12 * MB,
    credentials: 'same-origin',
    noise: {
      enabled: false,
      opacity: 0.16,
      fps: 24,
      tileSize: 64,
      grainSize: 1,
      monochrome: true,
      blendMode: 'soft-light'
    },
    fallback: {
      enabled: true,
      blur: 18,
      contrast: 0.92,
      saturation: 0.82
    }
  });

  const EASINGS = {
    linear: (t) => t,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
    easeOutQuart: (t) => 1 - Math.pow(1 - t, 4),
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  };

  const SUPPORT = Object.freeze({
    canvas: (() => {
      try {
        const canvas = document.createElement('canvas');
        return Boolean(canvas.getContext && canvas.getContext('2d'));
      } catch (_) {
        return false;
      }
    })(),
    raf: typeof global.requestAnimationFrame === 'function',
    intersectionObserver: 'IntersectionObserver' in global,
    mutationObserver: 'MutationObserver' in global,
    resizeObserver: 'ResizeObserver' in global,
    imageDecoder:
      'ImageDecoder' in global &&
      typeof global.ImageDecoder?.isTypeSupported === 'function' &&
      global.isSecureContext,
    webAnimations: 'animate' in Element.prototype
  });

  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === '[object Object]';
  }

  function merge(base, extra) {
    const output = { ...base };
    if (!isPlainObject(extra)) return output;
    for (const [key, value] of Object.entries(extra)) {
      if (isPlainObject(value) && isPlainObject(base[key])) {
        output[key] = merge(base[key], value);
      } else if (value !== undefined) {
        output[key] = value;
      }
    }
    return output;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function number(value, fallback, min = -Infinity, max = Infinity) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? clamp(parsed, min, max) : fallback;
  }

  function bool(value, fallback) {
    if (value == null || value === '') return fallback;
    if (typeof value === 'boolean') return value;
    const normalized = String(value).trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
    if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
    return fallback;
  }

  function parseSteps(value, fallback = 'auto') {
    if (value === 'auto' || String(value || '').trim().toLowerCase() === 'auto') return 'auto';
    if (Array.isArray(value)) {
      const list = value.map(Number).filter((item) => Number.isFinite(item) && item >= 1);
      if (list.length) return list;
    }
    if (typeof value === 'string') {
      const list = value
        .split(/[\s,]+/)
        .map(Number)
        .filter((item) => Number.isFinite(item) && item >= 1);
      if (list.length) return list;
    }
    return Array.isArray(fallback) ? fallback.slice() : 'auto';
  }

  function generateAutoSteps(count, width, height) {
    const stageCount = Math.round(number(count, 8, 2, 24));
    const shortestSide = Math.max(1, Math.min(width || 1, height || 1));
    const largestPixel = clamp(Math.round(shortestSide / 6), 20, 96);
    const smallestPixel = 1;
    const output = [];

    for (let index = 0; index < stageCount; index += 1) {
      const ratio = index / Math.max(1, stageCount - 1);
      const raw = largestPixel * Math.pow(smallestPixel / largestPixel, ratio);
      let value = Math.max(smallestPixel, Math.round(raw));
      if (output.length && value >= output[output.length - 1]) {
        value = Math.max(smallestPixel, output[output.length - 1] - 1);
      }
      output.push(value);
    }

    output[output.length - 1] = smallestPixel;
    return output;
  }

  function resolveSteps(options, width, height) {
    if (options.steps === 'auto') {
      return generateAutoSteps(options.stepCount, width, height);
    }
    const parsed = parseSteps(options.steps, 'auto');
    return parsed === 'auto' ? generateAutoSteps(options.stepCount, width, height) : parsed;
  }

  // A 1px stage is visually indistinguishable from the original image.
  // Treat it as the hand-off point instead of keeping the noisy canvas alive.
  function visibleMosaicSteps(steps) {
    const list = Array.isArray(steps) ? steps : [];
    if (list.length > 1 && list[list.length - 1] <= 1) return list.slice(0, -1);
    return list.length ? list : [2];
  }

  function mosaicStageIndex(progress, steps) {
    const visible = visibleMosaicSteps(steps);
    // Discrete pixel stages use equal time slices. Applying an ease-out curve
    // here makes the smallest stage appear far too early and leaves noise behind.
    const timeline = clamp(progress, 0, 1);
    return {
      steps: visible,
      index: Math.min(visible.length - 1, Math.floor(timeline * visible.length))
    };
  }

  function dispatch(img, name, detail = {}) {
    img.dispatchEvent(
      new CustomEvent(`pixelmosaic:${name}`, {
        bubbles: true,
        detail: { image: img, ...detail }
      })
    );
  }

  function resolveProfile(options) {
    if (options.quality !== 'auto') return options.quality;
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const saveData = Boolean(connection?.saveData);
    const memory = navigator.deviceMemory || 8;
    const cores = navigator.hardwareConcurrency || 8;
    const coarse = global.matchMedia?.('(pointer: coarse)').matches;
    if (saveData || memory <= 2 || cores <= 2) return 'low';
    if (memory <= 4 || cores <= 4 || coarse) return 'balanced';
    return 'high';
  }

  function applyProfile(options) {
    const profile = resolveProfile(options);
    const output = merge(options, {});
    output.profile = profile;
    if (profile === 'low') {
      output.maxConcurrent = Math.min(output.maxConcurrent, 1);
      output.maxDpr = Math.min(output.maxDpr, 1);
      output.renderFps = output.renderFps === 'auto' ? 24 : Math.min(output.renderFps, 30);
      output.noise.fps = Math.min(output.noise.fps, 12);
      output.noise.tileSize = Math.min(output.noise.tileSize, 48);
    } else if (profile === 'balanced') {
      output.maxConcurrent = Math.min(output.maxConcurrent, 2);
      output.maxDpr = Math.min(output.maxDpr, 1.5);
      output.renderFps = output.renderFps === 'auto' ? 30 : output.renderFps;
      output.noise.fps = Math.min(output.noise.fps, 20);
    } else {
      output.renderFps = output.renderFps === 'auto' ? 60 : output.renderFps;
    }
    return output;
  }

  function perImageOptions(img, base) {
    const data = img.dataset;
    const options = merge(base, {});
    options.duration = number(data.pmDuration, base.duration, 0, 60000);
    options.startDelay = number(data.pmStartDelay ?? data.pmDelay, base.startDelay, 0, 60000);
    options.stepDuration = number(data.pmStepDuration, base.stepDuration, 0, 10000);
    options.stepCount = Math.round(number(data.pmStepCount, base.stepCount, 2, 24));
    options.steps = parseSteps(data.pmSteps, base.steps);
    options.renderFps = number(data.pmFps, base.renderFps, 1, 120);
    options.maxDpr = number(data.pmDpr, base.maxDpr, 0.5, 4);

    if (data.pmNoise != null) {
      const numericNoise = Number(data.pmNoise);
      options.noise.enabled = bool(data.pmNoise, true);
      if (Number.isFinite(numericNoise)) {
        options.noise.enabled = numericNoise > 0;
        options.noise.opacity = clamp(numericNoise, 0, 1);
      }
    }
    options.noise.opacity = number(data.pmNoiseOpacity, options.noise.opacity, 0, 1);
    options.noise.fps = number(data.pmNoiseFps, options.noise.fps, 1, 60);
    options.noise.grainSize = number(data.pmNoiseGrain, options.noise.grainSize, 0.5, 8);
    if (data.pmNoiseColor) {
      options.noise.monochrome = data.pmNoiseColor.toLowerCase() !== 'color';
    }
    if (data.pmAnimatedMode) options.animatedMode = data.pmAnimatedMode;
    return options;
  }

  function sourceUrl(img) {
    return img.currentSrc || img.src || '';
  }

  function extensionFromUrl(url) {
    try {
      const pathname = new URL(url, document.baseURI).pathname.toLowerCase();
      const match = pathname.match(/\.([a-z0-9]+)$/i);
      return match ? match[1] : '';
    } catch (_) {
      return '';
    }
  }

  function typeFromUrl(url, responseType = '') {
    const cleanType = String(responseType).split(';')[0].trim().toLowerCase();
    if (cleanType.startsWith('image/')) return cleanType;
    if (/^data:image\//i.test(url)) return url.slice(5, url.indexOf(';') > -1 ? url.indexOf(';') : url.indexOf(','));
    const ext = extensionFromUrl(url);
    const types = {
      gif: 'image/gif',
      webp: 'image/webp',
      png: 'image/png',
      apng: 'image/png',
      avif: 'image/avif',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg'
    };
    return types[ext] || '';
  }

  function explicitAnimatedHint(img) {
    const raw = img.dataset.pmAnimated;
    if (raw == null || raw === '' || raw === 'auto') return null;
    return bool(raw, null);
  }

  function likelyAnimatedByName(url) {
    const ext = extensionFromUrl(url);
    if (ext === 'gif' || ext === 'apng') return true;
    if (ext === 'webp' || ext === 'png' || ext === 'avif') return null;
    return false;
  }

  function ascii(bytes, offset, length) {
    let output = '';
    for (let i = offset; i < offset + length && i < bytes.length; i += 1) {
      output += String.fromCharCode(bytes[i]);
    }
    return output;
  }

  function sniffGifAnimated(bytes) {
    if (ascii(bytes, 0, 3) !== 'GIF') return false;
    if (bytes.length < 13) return false;
    let offset = 13;
    const packed = bytes[10];
    if (packed & 0x80) offset += 3 * Math.pow(2, (packed & 0x07) + 1);
    let frames = 0;
    while (offset < bytes.length) {
      const marker = bytes[offset++];
      if (marker === 0x3b) break;
      if (marker === 0x2c) {
        frames += 1;
        if (frames > 1) return true;
        if (offset + 9 > bytes.length) break;
        const imagePacked = bytes[offset + 8];
        offset += 9;
        if (imagePacked & 0x80) offset += 3 * Math.pow(2, (imagePacked & 0x07) + 1);
        offset += 1;
      } else if (marker === 0x21) {
        offset += 1;
      } else {
        break;
      }
      while (offset < bytes.length) {
        const size = bytes[offset++];
        if (size === 0) break;
        offset += size;
      }
    }
    return false;
  }

  function sniffPngAnimated(bytes) {
    if (bytes.length < 12 || ascii(bytes, 1, 3) !== 'PNG') return false;
    let offset = 8;
    while (offset + 12 <= bytes.length) {
      const length =
        ((bytes[offset] << 24) >>> 0) +
        (bytes[offset + 1] << 16) +
        (bytes[offset + 2] << 8) +
        bytes[offset + 3];
      const type = ascii(bytes, offset + 4, 4);
      if (type === 'acTL') return true;
      if (type === 'IDAT' || type === 'IEND') return false;
      offset += 12 + length;
    }
    return false;
  }

  function sniffWebpAnimated(bytes) {
    if (ascii(bytes, 0, 4) !== 'RIFF' || ascii(bytes, 8, 4) !== 'WEBP') return false;
    let offset = 12;
    while (offset + 8 <= bytes.length) {
      const type = ascii(bytes, offset, 4);
      const size =
        bytes[offset + 4] |
        (bytes[offset + 5] << 8) |
        (bytes[offset + 6] << 16) |
        (bytes[offset + 7] << 24);
      if (type === 'ANIM' || type === 'ANMF') return true;
      offset += 8 + size + (size % 2);
    }
    return false;
  }

  function sniffAnimated(bytes, type) {
    if (type === 'image/gif') return sniffGifAnimated(bytes);
    if (type === 'image/png' || type === 'image/apng') return sniffPngAnimated(bytes);
    if (type === 'image/webp') return sniffWebpAnimated(bytes);
    return false;
  }

  async function fetchImageBytes(img, options) {
    const url = sourceUrl(img);
    if (!url) throw new Error('Image has no source URL.');
    const controller = 'AbortController' in global ? new AbortController() : null;
    const timer = controller
      ? global.setTimeout(() => controller.abort(), options.animatedFetchTimeout)
      : 0;
    try {
      const response = await fetch(url, {
        credentials: options.credentials,
        signal: controller?.signal
      });
      if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
      const contentLength = Number(response.headers.get('content-length'));
      if (contentLength && contentLength > options.animatedMaxBytes) {
        throw new Error('Animated image exceeds the decode byte limit.');
      }
      const buffer = await response.arrayBuffer();
      if (buffer.byteLength > options.animatedMaxBytes) {
        throw new Error('Animated image exceeds the decode byte limit.');
      }
      return {
        buffer,
        type: typeFromUrl(url, response.headers.get('content-type') || '')
      };
    } finally {
      if (timer) global.clearTimeout(timer);
    }
  }

  class AnimatedFrameSource {
    constructor(decoder, track) {
      this.decoder = decoder;
      this.track = track;
      this.frameCount = track.frameCount;
      this.current = null;
      this.next = null;
      this.currentIndex = 0;
      this.nextIndex = 1;
      this.nextAt = 0;
      this.loading = false;
      this.closed = false;
    }

    static async create(buffer, type) {
      if (!SUPPORT.imageDecoder || !type) return null;
      if (!(await global.ImageDecoder.isTypeSupported(type))) return null;
      const decoder = new global.ImageDecoder({ data: buffer, type, preferAnimation: true });
      if (decoder.tracks?.ready) await decoder.tracks.ready;
      if (decoder.completed) await decoder.completed;
      const track = decoder.tracks.selectedTrack;
      if (!track || !track.animated || track.frameCount < 2) {
        decoder.close();
        return null;
      }
      const source = new AnimatedFrameSource(decoder, track);
      await source.prime();
      return source;
    }

    async prime() {
      const first = await this.decoder.decode({ frameIndex: 0, completeFramesOnly: true });
      this.current = first.image;
      this.nextAt = this.durationOf(this.current);
      await this.preloadNext();
    }

    durationOf(frame) {
      const microseconds = Number(frame?.duration);
      return Number.isFinite(microseconds) && microseconds > 0
        ? clamp(microseconds / 1000, 16, 10000)
        : 100;
    }

    start(now) {
      this.nextAt = now + this.durationOf(this.current);
    }

    async preloadNext() {
      if (this.loading || this.closed || this.frameCount < 2) return;
      this.loading = true;
      const index = this.nextIndex % this.frameCount;
      try {
        const result = await this.decoder.decode({ frameIndex: index, completeFramesOnly: true });
        if (this.closed) {
          result.image.close();
          return;
        }
        this.next?.close();
        this.next = result.image;
      } catch (_) {
        // A missing frame degrades to the last valid frame; the original <img> remains underneath.
      } finally {
        this.loading = false;
      }
    }

    update(now) {
      if (!this.next || now < this.nextAt) return;
      this.current?.close();
      this.current = this.next;
      this.next = null;
      this.currentIndex = this.nextIndex % this.frameCount;
      this.nextIndex = (this.currentIndex + 1) % this.frameCount;
      this.nextAt = now + this.durationOf(this.current);
      this.preloadNext();
    }

    get drawable() {
      return this.current;
    }

    close() {
      if (this.closed) return;
      this.closed = true;
      this.current?.close();
      this.next?.close();
      this.decoder?.close();
      this.current = null;
      this.next = null;
    }
  }

  async function prepareSource(img, options) {
    const url = sourceUrl(img);
    const explicit = explicitAnimatedHint(img);
    const nameHint = likelyAnimatedByName(url);

    if (options.animationDetection === 'off' || explicit === false) {
      return { kind: 'still', drawable: img };
    }

    const mayAnimate = explicit === true || nameHint === true || nameHint === null;
    if (!mayAnimate) return { kind: 'still', drawable: img };

    const preserveOnly = options.animatedMode === 'preserve';
    const shouldFetch = options.animationDetection === 'auto' || explicit === true;
    let payload = null;
    let animated = explicit === true || nameHint === true;

    if (shouldFetch) {
      try {
        payload = await fetchImageBytes(img, options);
        const bytes = new Uint8Array(payload.buffer);
        animated = sniffAnimated(bytes, payload.type) || animated;
      } catch (error) {
        if (explicit === true || nameHint === true) {
          return { kind: 'animated-preserve', reason: error.message };
        }
        return { kind: 'still', drawable: img };
      }
    }

    if (!animated) return { kind: 'still', drawable: img };
    if (preserveOnly || !SUPPORT.imageDecoder || !payload) {
      return { kind: 'animated-preserve', reason: 'Animated decoding unavailable or disabled.' };
    }

    if (options.animatedMode === 'auto' && options.profile === 'low') {
      return { kind: 'animated-preserve', reason: 'Low-power profile.' };
    }

    try {
      const decoderSource = await AnimatedFrameSource.create(payload.buffer, payload.type);
      if (decoderSource) return { kind: 'animated-decoded', drawable: decoderSource };
    } catch (error) {
      return { kind: 'animated-preserve', reason: error.message };
    }
    return { kind: 'animated-preserve', reason: 'Animated codec not supported by ImageDecoder.' };
  }

  function parsePositionToken(token, freeSpace) {
    if (!token) return freeSpace / 2;
    const normalized = token.trim().toLowerCase();
    if (normalized === 'left' || normalized === 'top') return 0;
    if (normalized === 'center') return freeSpace / 2;
    if (normalized === 'right' || normalized === 'bottom') return freeSpace;
    if (normalized.endsWith('%')) return (number(normalized.slice(0, -1), 50) / 100) * freeSpace;
    if (normalized.endsWith('px')) return number(normalized.slice(0, -2), freeSpace / 2);
    return freeSpace / 2;
  }

  function objectFitMap(sourceWidth, sourceHeight, boxWidth, boxHeight, fit, position) {
    const parts = String(position || '50% 50%').trim().split(/\s+/);
    const px = parts[0] || '50%';
    const py = parts[1] || parts[0] || '50%';

    if (fit === 'fill') {
      return { sx: 0, sy: 0, sw: sourceWidth, sh: sourceHeight, dx: 0, dy: 0, dw: boxWidth, dh: boxHeight };
    }

    const containScale = Math.min(boxWidth / sourceWidth, boxHeight / sourceHeight);
    const coverScale = Math.max(boxWidth / sourceWidth, boxHeight / sourceHeight);
    let scale = fit === 'cover' ? coverScale : containScale;
    if (fit === 'none') scale = 1;
    if (fit === 'scale-down') scale = Math.min(1, containScale);

    const renderedWidth = sourceWidth * scale;
    const renderedHeight = sourceHeight * scale;
    const offsetX = parsePositionToken(px, boxWidth - renderedWidth);
    const offsetY = parsePositionToken(py, boxHeight - renderedHeight);

    if (fit === 'cover') {
      const sx = clamp(-offsetX / scale, 0, sourceWidth);
      const sy = clamp(-offsetY / scale, 0, sourceHeight);
      const sw = clamp(boxWidth / scale, 0, sourceWidth - sx);
      const sh = clamp(boxHeight / scale, 0, sourceHeight - sy);
      return { sx, sy, sw, sh, dx: 0, dy: 0, dw: boxWidth, dh: boxHeight };
    }

    return {
      sx: 0,
      sy: 0,
      sw: sourceWidth,
      sh: sourceHeight,
      dx: offsetX,
      dy: offsetY,
      dw: renderedWidth,
      dh: renderedHeight
    };
  }

  function sourceDimensions(drawable, img) {
    if (drawable && 'displayWidth' in drawable) {
      return {
        width: drawable.displayWidth || drawable.codedWidth,
        height: drawable.displayHeight || drawable.codedHeight
      };
    }
    return { width: img.naturalWidth, height: img.naturalHeight };
  }

  function intersectRect(a, b) {
    const left = Math.max(a.left, b.left);
    const top = Math.max(a.top, b.top);
    const right = Math.min(a.right, b.right);
    const bottom = Math.min(a.bottom, b.bottom);
    return {
      left,
      top,
      right,
      bottom,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top)
    };
  }

  function visibleRect(img, rect) {
    let visible = intersectRect(rect, {
      left: 0,
      top: 0,
      right: global.innerWidth,
      bottom: global.innerHeight
    });
    let parent = img.parentElement;
    while (parent && parent !== document.body && visible.width > 0 && visible.height > 0) {
      const style = getComputedStyle(parent);
      const clipsX = /(hidden|clip|scroll|auto)/.test(style.overflowX);
      const clipsY = /(hidden|clip|scroll|auto)/.test(style.overflowY);
      if (clipsX || clipsY) {
        const parentRect = parent.getBoundingClientRect();
        visible = intersectRect(visible, {
          left: clipsX ? parentRect.left : -Infinity,
          top: clipsY ? parentRect.top : -Infinity,
          right: clipsX ? parentRect.right : Infinity,
          bottom: clipsY ? parentRect.bottom : Infinity
        });
      }
      parent = parent.parentElement;
    }
    return visible;
  }

  function hasRoundedCorners(style) {
    return [
      style.borderTopLeftRadius,
      style.borderTopRightRadius,
      style.borderBottomRightRadius,
      style.borderBottomLeftRadius
    ].some((value) => String(value).split(/\s+/).some((part) => parseFloat(part) > 0));
  }

  function rectsMatch(a, b, tolerance = 1) {
    return (
      Math.abs(a.left - b.left) <= tolerance &&
      Math.abs(a.top - b.top) <= tolerance &&
      Math.abs(a.right - b.right) <= tolerance &&
      Math.abs(a.bottom - b.bottom) <= tolerance
    );
  }

  function radiusTolerance(style) {
    return Math.max(
      2,
      number(style.borderLeftWidth?.replace('px', ''), 0) + 1.5,
      number(style.borderTopWidth?.replace('px', ''), 0) + 1.5,
      number(style.borderRightWidth?.replace('px', ''), 0) + 1.5,
      number(style.borderBottomWidth?.replace('px', ''), 0) + 1.5
    );
  }

  function effectiveCornerRadii(img, rect) {
    const ownStyle = getComputedStyle(img);
    if (hasRoundedCorners(ownStyle)) {
      return {
        topLeft: ownStyle.borderTopLeftRadius,
        topRight: ownStyle.borderTopRightRadius,
        bottomRight: ownStyle.borderBottomRightRadius,
        bottomLeft: ownStyle.borderBottomLeftRadius
      };
    }

    let parent = img.parentElement;
    while (parent && parent !== document.body) {
      const style = getComputedStyle(parent);
      const clips = /(hidden|clip)/.test(`${style.overflow} ${style.overflowX} ${style.overflowY}`);
      if (
        clips &&
        hasRoundedCorners(style) &&
        rectsMatch(parent.getBoundingClientRect(), rect, radiusTolerance(style))
      ) {
        return {
          topLeft: style.borderTopLeftRadius,
          topRight: style.borderTopRightRadius,
          bottomRight: style.borderBottomRightRadius,
          bottomLeft: style.borderBottomLeftRadius
        };
      }
      parent = parent.parentElement;
    }

    return { topLeft: '0px', topRight: '0px', bottomRight: '0px', bottomLeft: '0px' };
  }

  function parseRadiusPair(value, width, height) {
    const parts = String(value || '0').trim().split(/\s+/);
    const parsePart = (part, reference) => {
      if (String(part).endsWith('%')) {
        return clamp((number(String(part).slice(0, -1), 0) / 100) * reference, 0, reference);
      }
      return clamp(number(String(part).replace('px', ''), 0), 0, reference);
    };
    return {
      x: parsePart(parts[0], width),
      y: parsePart(parts[1] || parts[0], height)
    };
  }

  function cornerRadiiPixels(radii, width, height) {
    const output = {
      topLeft: parseRadiusPair(radii.topLeft, width, height),
      topRight: parseRadiusPair(radii.topRight, width, height),
      bottomRight: parseRadiusPair(radii.bottomRight, width, height),
      bottomLeft: parseRadiusPair(radii.bottomLeft, width, height)
    };
    const scales = [
      width / Math.max(1, output.topLeft.x + output.topRight.x),
      width / Math.max(1, output.bottomLeft.x + output.bottomRight.x),
      height / Math.max(1, output.topLeft.y + output.bottomLeft.y),
      height / Math.max(1, output.topRight.y + output.bottomRight.y)
    ];
    const scale = Math.min(1, ...scales);
    if (scale < 1) {
      Object.values(output).forEach((corner) => {
        corner.x *= scale;
        corner.y *= scale;
      });
    }
    return output;
  }

  function roundedRectPath(ctx, width, height, radii) {
    const tl = radii.topLeft;
    const tr = radii.topRight;
    const br = radii.bottomRight;
    const bl = radii.bottomLeft;
    ctx.beginPath();
    ctx.moveTo(tl.x, 0);
    ctx.lineTo(width - tr.x, 0);
    ctx.quadraticCurveTo(width, 0, width, tr.y);
    ctx.lineTo(width, height - br.y);
    ctx.quadraticCurveTo(width, height, width - br.x, height);
    ctx.lineTo(bl.x, height);
    ctx.quadraticCurveTo(0, height, 0, height - bl.y);
    ctx.lineTo(0, tl.y);
    ctx.quadraticCurveTo(0, 0, tl.x, 0);
    ctx.closePath();
  }

  class PortalSurface {
    constructor(img, options) {
      this.img = img;
      this.options = options;
      this.host = document.createElement('div');
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d', { alpha: true, desynchronized: true });
      this.host.className = 'pm-portal';
      this.canvas.className = 'pm-canvas';
      this.host.setAttribute('aria-hidden', 'true');
      this.host.setAttribute('role', 'presentation');
      this.host.append(this.canvas);
      this.host.style.zIndex = String(options.zIndex);
      document.body.append(this.host);
      this.rect = null;
      this.visible = null;
      this.cssWidth = 0;
      this.cssHeight = 0;
      this.dpr = 1;
      this.radii = { topLeft: '0px', topRight: '0px', bottomRight: '0px', bottomLeft: '0px' };
      this.radiiPx = cornerRadiiPixels(this.radii, 1, 1);
      this.dirty = true;
      this.onDirty = () => {
        this.dirty = true;
      };
      global.addEventListener('resize', this.onDirty, { passive: true });
      global.addEventListener('scroll', this.onDirty, { passive: true, capture: true });
      if (SUPPORT.resizeObserver) {
        this.resizeObserver = new ResizeObserver(this.onDirty);
        this.resizeObserver.observe(img);
      }
    }

    sync(force = false) {
      if (!force && !this.dirty) return this.visible?.width > 0 && this.visible?.height > 0;
      this.dirty = false;
      const rect = this.img.getBoundingClientRect();
      const visible = visibleRect(this.img, rect);
      this.rect = rect;
      this.visible = visible;
      this.cssWidth = Math.max(1, rect.width);
      this.cssHeight = Math.max(1, rect.height);
      if (visible.width <= 0 || visible.height <= 0 || rect.width <= 0 || rect.height <= 0) {
        this.host.style.display = 'none';
        return false;
      }
      this.host.style.display = 'block';
      Object.assign(this.host.style, {
        left: `${visible.left}px`,
        top: `${visible.top}px`,
        width: `${visible.width}px`,
        height: `${visible.height}px`
      });
      Object.assign(this.canvas.style, {
        left: `${rect.left - visible.left}px`,
        top: `${rect.top - visible.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`
      });
      const computed = getComputedStyle(this.img);
      this.radii = effectiveCornerRadii(this.img, rect);
      this.radiiPx = cornerRadiiPixels(this.radii, rect.width, rect.height);
      const touchesLeft = Math.abs(visible.left - rect.left) <= 0.5;
      const touchesTop = Math.abs(visible.top - rect.top) <= 0.5;
      const touchesRight = Math.abs(visible.right - rect.right) <= 0.5;
      const touchesBottom = Math.abs(visible.bottom - rect.bottom) <= 0.5;
      const visibleRadii = {
        topLeft: touchesLeft && touchesTop ? this.radii.topLeft : '0px',
        topRight: touchesRight && touchesTop ? this.radii.topRight : '0px',
        bottomRight: touchesRight && touchesBottom ? this.radii.bottomRight : '0px',
        bottomLeft: touchesLeft && touchesBottom ? this.radii.bottomLeft : '0px'
      };

      Object.assign(this.host.style, {
        borderTopLeftRadius: visibleRadii.topLeft,
        borderTopRightRadius: visibleRadii.topRight,
        borderBottomRightRadius: visibleRadii.bottomRight,
        borderBottomLeftRadius: visibleRadii.bottomLeft
      });
      Object.assign(this.canvas.style, {
        borderTopLeftRadius: this.radii.topLeft,
        borderTopRightRadius: this.radii.topRight,
        borderBottomRightRadius: this.radii.bottomRight,
        borderBottomLeftRadius: this.radii.bottomLeft,
        clipPath: computed.clipPath && computed.clipPath !== 'none' ? computed.clipPath : 'none'
      });
      this.dpr = clamp(global.devicePixelRatio || 1, 1, this.options.maxDpr);
      const pixelWidth = Math.max(1, Math.round(this.cssWidth * this.dpr));
      const pixelHeight = Math.max(1, Math.round(this.cssHeight * this.dpr));
      if (this.canvas.width !== pixelWidth || this.canvas.height !== pixelHeight) {
        this.canvas.width = pixelWidth;
        this.canvas.height = pixelHeight;
      }
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      return true;
    }

    beginClip(ctx) {
      const hasRadius = Object.values(this.radiiPx).some((corner) => corner.x > 0 || corner.y > 0);
      if (!hasRadius) return false;
      ctx.save();
      roundedRectPath(ctx, this.cssWidth, this.cssHeight, this.radiiPx);
      ctx.clip();
      return true;
    }

    endClip(ctx, clipped) {
      if (clipped) ctx.restore();
    }

    setOpacity(value) {
      this.host.style.opacity = String(clamp(value, 0, 1));
    }

    destroy() {
      global.removeEventListener('resize', this.onDirty);
      global.removeEventListener('scroll', this.onDirty, true);
      this.resizeObserver?.disconnect();
      this.host.remove();
    }
  }

  class NoisePainter {
    constructor(options) {
      this.options = options;
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = options.tileSize;
      this.canvas.height = options.tileSize;
      this.imageData = this.ctx.createImageData(options.tileSize, options.tileSize);
      this.pattern = null;
      this.seed = (Math.random() * 0xffffffff) >>> 0;
      this.lastAt = -Infinity;
    }

    randomByte() {
      let x = this.seed;
      x ^= x << 13;
      x ^= x >>> 17;
      x ^= x << 5;
      this.seed = x >>> 0;
      return this.seed & 0xff;
    }

    update(now) {
      if (now - this.lastAt < 1000 / this.options.fps) return false;
      this.lastAt = now;
      const data = this.imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (this.options.monochrome) {
          const value = this.randomByte();
          data[i] = value;
          data[i + 1] = value;
          data[i + 2] = value;
        } else {
          data[i] = this.randomByte();
          data[i + 1] = this.randomByte();
          data[i + 2] = this.randomByte();
        }
        data[i + 3] = 255;
      }
      this.ctx.putImageData(this.imageData, 0, 0);
      this.pattern = null;
      return true;
    }

    paint(ctx, width, height, clipRect = null) {
      if (!this.pattern) {
        this.pattern = ctx.createPattern(this.canvas, 'repeat');
        if (this.pattern?.setTransform && 'DOMMatrix' in global) {
          this.pattern.setTransform(new DOMMatrix().scale(this.options.grainSize));
        }
      }
      if (!this.pattern) return;
      ctx.save();
      if (clipRect) {
        ctx.beginPath();
        ctx.rect(clipRect.dx, clipRect.dy, clipRect.dw, clipRect.dh);
        ctx.clip();
      }
      ctx.globalAlpha = this.options.opacity;
      try {
        ctx.globalCompositeOperation = this.options.blendMode;
      } catch (_) {
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.fillStyle = this.pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }

  class MosaicEffect {
    constructor(img, source, options, done) {
      this.img = img;
      this.source = source;
      this.options = options;
      this.done = done;
      this.surface = new PortalSurface(img, options);
      this.small = document.createElement('canvas');
      this.smallCtx = this.small.getContext('2d', { alpha: true });
      this.noise = options.noise.enabled ? new NoisePainter(options.noise) : null;
      this.raf = 0;
      this.startAt = 0;
      this.lastDrawAt = -Infinity;
      this.lastStage = -1;
      this.cancelled = false;
      this.finishBound = () => this.finish('cancelled');
      document.addEventListener('visibilitychange', this.finishBound);
    }

    start() {
      if (!this.surface.sync(true)) {
        this.finish('not-visible');
        return;
      }
      this.startAt = performance.now();
      if (this.source instanceof AnimatedFrameSource) this.source.start(this.startAt);
      dispatch(this.img, 'start', {
        mode: this.source instanceof AnimatedFrameSource ? 'animated-decoded' : 'canvas',
        startDelay: this.options.startDelay,
        steps: this.options.steps.slice()
      });
      this.raf = requestAnimationFrame((now) => this.tick(now));
    }

    tick(now) {
      if (this.cancelled || !this.img.isConnected) {
        this.finish('removed');
        return;
      }
      if (document.hidden) {
        this.finish('hidden');
        return;
      }
      const displaySteps = visibleMosaicSteps(this.options.steps);
      const duration = this.options.stepDuration > 0
        ? this.options.stepDuration * displaySteps.length
        : this.options.duration;
      const elapsed = now - this.startAt;
      const revealElapsed = Math.max(0, elapsed - this.options.startDelay);
      const progress = elapsed < this.options.startDelay
        ? 0
        : clamp(revealElapsed / Math.max(1, duration), 0, 1);
      if (progress >= 1) {
        this.finish('complete');
        return;
      }

      const fadePortion = clamp(this.options.fadePortion, 0, 0.5);
      const fadeStart = 1 - fadePortion;
      const stageProgress = fadePortion > 0 ? clamp(progress / Math.max(0.001, fadeStart), 0, 1) : progress;
      const stage = mosaicStageIndex(stageProgress, this.options.steps);
      const stageIndex = stage.index;
      const frameInterval = 1000 / this.options.renderFps;
      const shouldDraw = stageIndex !== this.lastStage || now - this.lastDrawAt >= frameInterval;

      this.source?.update?.(now);
      if (shouldDraw) {
        this.surface.sync();
        this.draw(now, stage.steps[stageIndex]);
        this.lastDrawAt = now;
        this.lastStage = stageIndex;
      }

      const fade = fadePortion <= 0 || progress <= fadeStart
        ? 1
        : 1 - (progress - fadeStart) / Math.max(0.001, 1 - fadeStart);
      this.surface.setOpacity(fade);

      this.raf = requestAnimationFrame((time) => this.tick(time));
    }

    draw(now, pixelSize) {
      const drawable = this.source instanceof AnimatedFrameSource ? this.source.drawable : this.img;
      if (!drawable || !this.surface.rect) return;
      const width = this.surface.cssWidth;
      const height = this.surface.cssHeight;
      const dimensions = sourceDimensions(drawable, this.img);
      if (!dimensions.width || !dimensions.height) return;
      const computed = getComputedStyle(this.img);
      const map = objectFitMap(
        dimensions.width,
        dimensions.height,
        width,
        height,
        computed.objectFit || 'fill',
        computed.objectPosition || '50% 50%'
      );

      const smallWidth = Math.max(1, Math.ceil(width / Math.max(1, pixelSize)));
      const smallHeight = Math.max(1, Math.ceil(height / Math.max(1, pixelSize)));
      if (this.small.width !== smallWidth || this.small.height !== smallHeight) {
        this.small.width = smallWidth;
        this.small.height = smallHeight;
      }
      this.smallCtx.clearRect(0, 0, smallWidth, smallHeight);
      this.smallCtx.imageSmoothingEnabled = true;
      try {
        this.smallCtx.drawImage(
          drawable,
          map.sx,
          map.sy,
          map.sw,
          map.sh,
          (map.dx / width) * smallWidth,
          (map.dy / height) * smallHeight,
          (map.dw / width) * smallWidth,
          (map.dh / height) * smallHeight
        );
      } catch (error) {
        this.finish('draw-error', error);
        return;
      }

      const ctx = this.surface.ctx;
      ctx.setTransform(this.surface.dpr, 0, 0, this.surface.dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const clipped = this.surface.beginClip(ctx);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.small, 0, 0, smallWidth, smallHeight, 0, 0, width, height);
      if (this.noise) {
        this.noise.update(now);
        this.noise.paint(ctx, width, height, map);
      }
      this.surface.endClip(ctx, clipped);
    }

    finish(reason, error = null) {
      if (this.cancelled) return;
      this.cancelled = true;
      cancelAnimationFrame(this.raf);
      document.removeEventListener('visibilitychange', this.finishBound);
      this.surface.setOpacity(0);
      this.surface.host.style.visibility = 'hidden';
      this.surface.destroy();
      this.source?.close?.();
      if (error) dispatch(this.img, 'error', { reason, error });
      else dispatch(this.img, 'complete', { reason });
      this.done?.();
    }
  }

  class MotionPreservingFallback {
    constructor(img, options, done, reason) {
      this.img = img;
      this.options = options;
      this.done = done;
      this.reason = reason;
      this.surface = SUPPORT.canvas ? new PortalSurface(img, options) : null;
      this.small = this.surface ? document.createElement('canvas') : null;
      this.smallCtx = this.small?.getContext('2d', { alpha: true }) || null;
      this.noise = this.surface && options.noise.enabled ? new NoisePainter(options.noise) : null;
      this.raf = 0;
      this.startAt = 0;
      this.animation = null;
      this.timer = 0;
      this.finished = false;
    }

    start() {
      this.startAt = performance.now();

      // Canvas가 있으면 원본 애니메이션은 손대지 않고 계속 재생시킨다.
      // 픽셀 모자이크와 노이즈는 포털 Canvas만 담당하므로 종료 직전 블러 플래시가 없다.
      if (this.surface) {
        this.surface.sync(true);
        this.raf = requestAnimationFrame((now) => this.tick(now));
      } else {
        const computed = getComputedStyle(this.img);
        const baseFilter = computed.filter === 'none' ? '' : computed.filter;
        const frames = this.options.steps.map((_, index) => {
          const ratio = index / Math.max(1, this.options.steps.length - 1);
          const blur = this.options.fallback.blur * (1 - ratio);
          const contrast = this.options.fallback.contrast + (1 - this.options.fallback.contrast) * ratio;
          const saturation = this.options.fallback.saturation + (1 - this.options.fallback.saturation) * ratio;
          return {
            offset: ratio,
            filter: `blur(${blur.toFixed(2)}px) contrast(${contrast.toFixed(3)}) saturate(${saturation.toFixed(3)}) ${baseFilter}`.trim(),
            opacity: String(0.78 + 0.22 * ratio)
          };
        });
        frames[frames.length - 1].filter = baseFilter || 'none';
        frames[frames.length - 1].opacity = computed.opacity;

        if (SUPPORT.webAnimations) {
          this.animation = this.img.animate(frames, {
            duration: this.options.duration,
            delay: this.options.startDelay,
            easing: `steps(${Math.max(2, this.options.steps.length)}, end)`,
            fill: 'backwards'
          });
          this.animation.finished.then(() => this.finish()).catch(() => this.finish());
        } else {
          this.img.classList.add('pm-css-fallback');
          this.img.style.setProperty('--pm-duration', `${this.options.duration}ms`);
          this.img.style.setProperty('--pm-delay', `${this.options.startDelay}ms`);
          this.timer = global.setTimeout(
            () => this.finish(),
            this.options.startDelay + this.options.duration
          );
        }
      }

      dispatch(this.img, 'start', {
        mode: 'motion-preserving-fallback',
        reason: this.reason,
        startDelay: this.options.startDelay,
        steps: this.options.steps.slice()
      });
    }

    tick(now) {
      if (this.finished || !this.surface) return;
      const elapsed = now - this.startAt;
      const revealElapsed = Math.max(0, elapsed - this.options.startDelay);
      const progress = elapsed < this.options.startDelay
        ? 0
        : clamp(revealElapsed / Math.max(1, this.options.duration), 0, 1);
      if (progress >= 1) {
        this.finish();
        return;
      }
      const stage = mosaicStageIndex(progress, this.options.steps);

      this.surface.sync();
      this.draw(now, stage.steps[stage.index]);
      const fadePortion = clamp(this.options.fadePortion, 0, 0.5);
      const fadeStart = 1 - fadePortion;
      const fade = fadePortion <= 0 || progress <= fadeStart
        ? 1
        : 1 - (progress - fadeStart) / Math.max(0.001, 1 - fadeStart);
      this.surface.setOpacity(fade);
      this.raf = requestAnimationFrame((time) => this.tick(time));
    }

    draw(now, pixelSize) {
      const width = this.surface.cssWidth;
      const height = this.surface.cssHeight;
      const dimensions = sourceDimensions(this.img, this.img);
      if (!dimensions.width || !dimensions.height) return;
      const computed = getComputedStyle(this.img);
      const map = objectFitMap(
        dimensions.width,
        dimensions.height,
        width,
        height,
        computed.objectFit || 'fill',
        computed.objectPosition || '50% 50%'
      );
      const smallWidth = Math.max(1, Math.ceil(width / Math.max(1, pixelSize)));
      const smallHeight = Math.max(1, Math.ceil(height / Math.max(1, pixelSize)));
      if (this.small.width !== smallWidth || this.small.height !== smallHeight) {
        this.small.width = smallWidth;
        this.small.height = smallHeight;
      }
      this.smallCtx.clearRect(0, 0, smallWidth, smallHeight);
      this.smallCtx.imageSmoothingEnabled = true;
      try {
        this.smallCtx.drawImage(
          this.img,
          map.sx,
          map.sy,
          map.sw,
          map.sh,
          (map.dx / width) * smallWidth,
          (map.dy / height) * smallHeight,
          (map.dw / width) * smallWidth,
          (map.dh / height) * smallHeight
        );
      } catch (_) {
        return;
      }

      const ctx = this.surface.ctx;
      ctx.setTransform(this.surface.dpr, 0, 0, this.surface.dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const clipped = this.surface.beginClip(ctx);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(this.small, 0, 0, smallWidth, smallHeight, 0, 0, width, height);
      if (this.noise) {
        this.noise.update(now);
        this.noise.paint(ctx, width, height, map);
      }
      this.surface.endClip(ctx, clipped);
    }

    finish(reason = 'motion-preserving-fallback') {
      if (this.finished) return;
      this.finished = true;
      cancelAnimationFrame(this.raf);
      if (this.timer) global.clearTimeout(this.timer);
      this.animation?.cancel();
      this.img.classList.remove('pm-css-fallback');
      this.img.style.removeProperty('--pm-duration');
      this.img.style.removeProperty('--pm-delay');
      if (this.surface) {
        this.surface.setOpacity(0);
        this.surface.host.style.visibility = 'hidden';
        this.surface.destroy();
      }
      dispatch(this.img, 'complete', {
        reason,
        detail: this.reason
      });
      this.done?.();
    }
  }

  class PixelMosaicController {
    constructor(options = {}) {
      this.options = applyProfile(merge(DEFAULTS, options));
      this.records = new WeakMap();
      this.images = new Set();
      this.queue = [];
      this.active = 0;
      this.destroyed = false;
      this.reducedMotion = Boolean(
        this.options.respectReducedMotion &&
          global.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      );
      this.selector = this.options.autoDetect ? this.options.autoSelector : this.options.selector;
      this.onIntersect = this.onIntersect.bind(this);
      this.observer = SUPPORT.intersectionObserver
        ? new IntersectionObserver(this.onIntersect, {
            threshold: this.options.threshold,
            rootMargin: this.options.rootMargin
          })
        : null;
      this.start();
    }

    start() {
      this.scan(document);
      if (SUPPORT.mutationObserver) {
        this.mutationObserver = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) this.scan(node);
              });
            }
          }
        });
        this.mutationObserver.observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      }
      return this;
    }

    scan(root = document) {
      if (this.destroyed || !root) return this;
      const candidates = [];
      if (root instanceof HTMLImageElement && root.matches(this.selector)) candidates.push(root);
      if (root.querySelectorAll) candidates.push(...root.querySelectorAll(this.selector));
      candidates.forEach((img) => this.register(img));
      return this;
    }

    register(img) {
      if (!(img instanceof HTMLImageElement) || this.records.has(img)) return;
      if (this.options.exclude && img.matches(this.options.exclude)) return;
      const record = {
        img,
        state: 'waiting',
        played: false,
        source: sourceUrl(img),
        effect: null,
        loadHandler: null
      };
      record.loadHandler = () => this.onLoad(record);
      img.addEventListener('load', record.loadHandler);
      img.addEventListener('error', () => dispatch(img, 'error', { reason: 'image-load-error' }), {
        once: true
      });
      this.records.set(img, record);
      this.images.add(img);
      if (img.complete && img.naturalWidth > 0) this.onLoad(record);
    }

    onLoad(record) {
      if (this.destroyed || !record.img.isConnected) return;
      const current = sourceUrl(record.img);
      if (record.played && current !== record.source) {
        record.source = current;
        if (!this.options.replayOnSourceChange) return;
        record.played = false;
        record.state = 'waiting';
      }
      if (record.played || record.state === 'queued' || record.state === 'active') return;
      record.state = 'ready';
      if (this.options.startOn === 'visible' && this.observer) {
        this.observer.observe(record.img);
      } else {
        this.enqueue(record);
      }
    }

    onIntersect(entries) {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const record = this.records.get(entry.target);
        if (!record) continue;
        this.observer.unobserve(entry.target);
        this.enqueue(record);
      }
    }

    enqueue(record) {
      if (record.played || record.state === 'queued' || record.state === 'active') return;
      record.state = 'queued';
      this.queue.push(record);
      this.drain();
    }

    drain() {
      while (!this.destroyed && this.active < this.options.maxConcurrent && this.queue.length) {
        const record = this.queue.shift();
        if (!record?.img.isConnected) continue;
        this.active += 1;
        record.state = 'active';
        this.playRecord(record).finally(() => {
          this.active -= 1;
          this.drain();
        });
      }
    }

    async playRecord(record) {
      const img = record.img;
      const rect = img.getBoundingClientRect();
      if (rect.width < this.options.minWidth || rect.height < this.options.minHeight) {
        record.played = true;
        record.state = 'complete';
        dispatch(img, 'skip', { reason: 'below-minimum-size' });
        return;
      }
      if (this.reducedMotion) {
        record.played = true;
        record.state = 'complete';
        dispatch(img, 'skip', { reason: 'prefers-reduced-motion' });
        return;
      }

      const options = perImageOptions(img, this.options);
      options.steps = resolveSteps(options, rect.width, rect.height);
      if (img.decode) await img.decode().catch(() => {});
      let source;
      try {
        source = await prepareSource(img, options);
      } catch (error) {
        source = { kind: 'still', drawable: img, error };
      }

      await new Promise((resolve) => {
        const complete = () => {
          record.played = true;
          record.state = 'complete';
          record.effect = null;
          resolve();
        };

        if (source.kind === 'animated-preserve' || !SUPPORT.canvas || !SUPPORT.raf) {
          if (!options.fallback.enabled) {
            dispatch(img, 'skip', { reason: source.reason || 'unsupported-browser' });
            complete();
            return;
          }
          record.effect = new MotionPreservingFallback(
            img,
            options,
            complete,
            source.reason || 'Canvas animation unavailable.'
          );
        } else {
          record.effect = new MosaicEffect(img, source.drawable, options, complete);
        }
        record.effect.start();
      });
    }

    play(target) {
      const img = typeof target === 'string' ? document.querySelector(target) : target;
      if (!(img instanceof HTMLImageElement)) return false;
      if (!this.records.has(img)) this.register(img);
      const record = this.records.get(img);
      if (record.effect) {
        record.effect.finish?.('replayed');
        record.effect = null;
      }
      record.played = false;
      record.state = 'ready';
      this.observer?.unobserve(img);
      this.enqueue(record);
      return true;
    }

    replay(root = document) {
      const list = root instanceof HTMLImageElement ? [root] : [...root.querySelectorAll(this.selector)];
      list.forEach((img) => this.play(img));
      return this;
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      this.observer?.disconnect();
      this.mutationObserver?.disconnect();
      this.queue.length = 0;
      for (const img of this.images) {
        const record = this.records.get(img);
        img.removeEventListener('load', record?.loadHandler);
        record?.effect?.finish?.('controller-destroyed');
      }
      this.images.clear();
    }
  }

  const api = {
    version: VERSION,
    support: SUPPORT,
    defaults: DEFAULTS,
    init(options) {
      return new PixelMosaicController(options);
    }
  };

  global.PixelMosaic = api;
})(window);
