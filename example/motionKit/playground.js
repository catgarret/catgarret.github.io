(() => {
  'use strict';

  const MODULE_ATTRIBUTES = {
    parallax: 'data-mk-parallax', mouseParallax: 'data-mk-mouse-parallax', reveal: 'data-mk-reveal',
    counter: 'data-mk-counter', lazy: 'data-mk-lazy', textSplit: 'data-mk-text-split',
    blurText: 'data-mk-blur-text', shuffle: 'data-mk-shuffle', typewriter: 'data-mk-typewriter',
    textReveal: 'data-mk-text-reveal', textTransition: 'data-mk-text-transition', magnetic: 'data-mk-magnetic',
    ripple: 'data-mk-ripple', marquee: 'data-mk-marquee', overflowText: 'data-mk-overflow-text',
    tilt: 'data-mk-tilt', cursor: 'data-mk-cursor', textFill: 'data-mk-text-fill', stickyStack: 'data-mk-sticky-stack',
    scrollVelocity: 'data-mk-scroll-velocity', slider: 'data-mk-slider', ambientMedia: 'data-mk-ambient-media',
    glitch: 'data-mk-glitch', cardGlow: 'data-mk-card-glow', lightbox: 'data-mk-lightbox', vibrate: 'data-mk-vibrate',
    cssScroll: 'data-mk-css-scroll', scrollSequence: 'data-mk-scroll-sequence', brushReveal: 'data-mk-brush-reveal'
  };

  const PUBLIC_OPTIONS = {"ambientMedia":["allowOverflow","ambientSrc","ambientSrcset","blur","brightness","color","fallbackColor","hideOnPause","inset","opacity","radius","sampleFps","sampleHeight","sampleWidth","saturation","scale","source","src"],"blurText":["duration","ease","onComplete","once","stagger","start"],"brushReveal":["blur","crossOrigin","fade","maxDpr","onError","opacity","persist","radius","revealSrc","softness","src"],"cardGlow":["alwaysOn","blendMode","blur","borderBlur","borderColor","borderColor2","borderGlow","borderInset","borderOpacity","borderRadius","borderWidth","color","color1","color2","cycleDuration","duration","ease","follow","halo","intensity","luminousBorder","mode","opacity","preset","radius","reflection","sensitivity","smoothing","speed","spread","surface","surfaceBlend","surfaceBlur","surfaceColor","surfaceColor2","surfaceGradient","surfaceInset","surfaceOpacity","surfaceSize"],"counter":["bareBackground","comma","decimals","delay","duration","ease","format","from","gap","grouping","lineHeight","locale","loops","mode","onComplete","once","popAlign","popDuration","popScale","prefix","preset","separator","stagger","start","style","suffix","tile","tileColor","tileRadius","tileTextColor","to"],"cssScroll":["cssAnimation","end","onUpdate","property","rangeEnd","rangeStart","start"],"cursor":["backdropFilter","background","blur","borderColor","borderWidth","className","clickImage","clickImageDuration","clickImageSize","clickSprite","clickSpriteDuration","clickSpriteFrames","clickSpriteHeight","clickSpriteWidth","color","crosshairSize","dot","dotColor","dotSize","ease","follower","followerSize","full","global","height","hiddenSelector","hideDotOnHover","hoverBackground","hoverColor","hoverDotOpacity","hoverDotSize","hoverEffect","hoverLabel","hoverScale","hoverSelector","html","label","labelColor","labelSize","mixBlendMode","onEnter","onLeave","opacity","orbitRadius","orbitSpeed","orbitSquash","orbitText","preset","pressScale","radius","rotate","rotateDuration","rotateText","shadow","shape","smoothing","snakeText","sparkleColor","sparkleColor2","sparkleDuration","sparkleSize","sparkleSymbols","sparkleThrottle","speed","spring","src","template","text","textColor","trailColor","trailCount","trailSize","type","width","zIndex"],"glitch":["blendMode","colors","delay","intensity","loop","preset","sliceCount","speed","trigger","type"],"lazy":["animated","aspectRatio","blur","crossOrigin","delay","direction","display","duration","ease","edgeOpacity","edgeWidth","effect","fadeDuration","fallbackSrc","feather","flickerBackground","frame","frameColor","glitchStrength","height","holdDuration","keepFrame","maxDpr","minDuration","nativeLazy","noise","noiseBlend","noiseContrast","noiseFps","noiseHeight","noiseWidth","objectFit","objectPosition","onError","onLoad","onProgress","pixelEnd","pixelStart","pixelStepCount","preset","renderFps","rootMargin","rotate","sizes","skeletonAngle","skeletonColor","skeletonHighlight","skeletonIcon","skeletonSpeed","skeletonVariant","sliceCount","src","srcset","startScale","stepCount","stepDuration","steps","threshold","variant"],"lightbox":["alt","backdropColor","backdropOpacity","caption","className","cursor","description","doubleClickZoom","duration","group","info","lazyEffect","lazyOptions","maxZoom","metadata","minZoom","minimap","onChange","onClose","onLoad","onOpen","radius","renderUI","src","title","toolbar","uiTemplate","wheelStep","zoom","zoomStep"],"loader":["ariaLabel","barHeight","barWidth","color","completeHold","completeOnError","duration","exit","exitDuration","expectedResources","fetch","fetchOptions","hideScrollbar","label","manualDuration","minDuration","onComplete","onError","onProgress","percent","preset","progress","progressSource","promise","promiseCeiling","promiseStart","resourceSelector","resources","showPercent","size","smoothing","source","stroke","trackColor","transition","type","url"],"magnetic":["ease","radius","strength"],"marquee":["clones","direction","pauseOnHover","reverseOnScrollUp","scrollAcceleration","speed"],"mouseParallax":["compassRange","ease","global","gyro","maxX","maxY","mode","preset","rotateOffset","sensitivity","smoothing","speed"],"overflowText":["ariaLive","delay","direction","dissolveDuration","easing","ellipsis","endPause","flipDirection","flipDuration","force","gap","holdDuration","items","jitter","maskDirection","maskDuration","maskEase","mode","onChange","onPage","pageDuration","pageOverlap","pauseOnHover","perspective","preset","repeat","restartDelay","role","rollDirection","rollDuration","speed","text","threshold","title","transitionDirection"],"pageReveal":["axis","color","color2","count","delay","direction","duration","ease","effect","onComplete","preset","stagger"],"pageTransition":["animationSelector","cache","container","executeScripts","linkSelector","minDuration","onClick","onEnter","onError","onLeave","scrollTop"],"parallax":["axis","distance","end","onUpdate","scrub","speed","start"],"progress":["onUpdate","property","target"],"reveal":["activeClass","classOnly","clockDirection","delay","direction","duration","ease","end","enterClass","leaveClass","onClassChange","onComplete","onEnter","onEnterBack","onLeave","onLeaveBack","once","preset","removeClassOnLeave","rootMargin","spring","stagger","start","startAngle","threshold"],"ripple":["centered","color","disableInReducedMotion","duration","easing","opacity","scale","unbounded"],"scrollSequence":["crossOrigin","end","extension","fit","frames","height","maxDpr","onError","onFrame","padding","preloadRadius","scrollLength","scrub","start","urlPrefix","urls","vhPerFrame"],"scrollVelocity":["axis","damping","decay","distance","effect","elastic","end","global","mass","maxBlur","maxRotate","maxScale","maxSkew","mode","onDirection","onUpdate","preset","response","reverse","smoothing","spring","start","stiffness","velocityDivisor"],"shuffle":["chars","onComplete","revealRate","rootMargin","speed","text","threshold"],"slider":["align","autoplay","depth","duration","effect","gap","initial","label","loop","minOpacity","minScale","nextSelector","onChange","opacityStep","pauseOnHover","perView","perspective","preset","prevSelector","rotate","scaleStep","smoothing","spacing","speed"],"stickyStack":["align","blur","bottomSpace","distance","ease","effect","end","fadePrevious","gap","itemDuration","itemHeight","minHeight","mode","offset","offsetTop","offsetY","onProgress","overlap","panelWidth","perspective","pin","pinSpacing","preset","previousBlur","previousOpacity","previousScale","previousY","reverseZ","rotate","scaleFrom","scalePrevious","scrollLength","scrub","snap","start","top","transformOrigin","transitionStartOffset","type"],"textFill":["baseColor","end","fillColor","onUpdate","scrub","start"],"textReveal":["chars","delay","duration","ease","flickerCount","flickerLoop","hold","loop","mode","onComplete","preset","rootMargin","speed","stagger","text","threshold"],"textSplit":["animation","by","delay","duration","ease","hold","onComplete","onSwap","once","pause","perspective","preset","stagger","start","swapEase","swapOut","texts"],"textTransition":["ariaLive","baseColor","blur","charMode","duration","ease","effect","endScale","hold","jitter","loop","minHeight","onChange","onComplete","pause","preset","shimColor","shimSpeed","stagger","startScale","texts"],"tilt":["axis","ease","glare","glareBlur","glareColor","glareOpacity","glareRadius","gyro","max","maxX","maxY","perspective","reset","reverse","scale","sensitivity","smoothing"],"typewriter":["caret","caretChar","compose","eraseSpeed","hangul","loop","onComplete","pauseAfter","strings","typeSpeed"],"vibrate":["haptic","pattern","preset","threshold","trigger"]};

  const FIELDS = {
    counter: [
      ['preset','Mode','select',['slot','plain','digit','pop','flip']], ['to','Target','number'], ['format','Grouping','select',['',',']],
      ['locale','Locale','text'], ['duration','Duration','range',0.1,4,0.1], ['loops','Digit loops','range',0,6,1],
      ['popScale','Pop scale','range',1,3,0.05], ['popAlign','Pop align','select',['bottom','center','top']], ['popDuration','Pop duration','range',0.05,1,0.05],
      ['stagger','Stagger','range',0,0.3,0.01], ['prefix','Prefix','text'], ['suffix','Suffix','text'],
      ['tile','Flip tile','checkbox'], ['tileColor','Tile color','color'], ['tileTextColor','Tile text','color'], ['gap','Flip gap','range',0,12,1]
    ],
    lazy: [
      ['preset','Effect','select',['fade','blur-up','skeleton','pixelate','print','dissolve','flicker','polaroid']],
      ['glitchStrength','Glitch strength','range',0.1,3,0.05], ['sliceCount','Glitch slices','range',2,16,1],
      ['duration','Duration','range',0.1,4,0.1], ['delay','Delay (ms)','range',0,1500,50], ['blur','Blur','range',0,40,1],
      ['noise','Noise','range',0,1,0.01], ['direction','Direction','select',['down','up','left','right']],
      ['feather','Feather','range',0,180,5], ['steps','Explicit steps (px)','text'], ['stepCount','Pixel steps','range',2,16,1],
      ['stepDuration','Step time (ms)','range',0,600,10], ['holdDuration','Hold (ms)','range',0,1200,50],
      ['minDuration','Placeholder min (ms)','range',0,2500,100], ['skeletonColor','Skeleton color','color'], ['skeletonHighlight','Skeleton highlight','color'], ['skeletonIcon','Skeleton icon','checkbox'], ['startScale','Start scale','range',0.7,1.4,0.01]
    ],
    overflowText: [
      ['preset','Mode','select',['loop','bounce','rewind','once','page','flip','dissolve','page-roll','rolling']], ['speed','Speed','range',10,180,2],
      ['delay','Start pause (ms)','range',0,2500,50], ['endPause','End pause (ms)','range',0,2500,50],
      ['restartDelay','Restart delay (ms)','range',0,4000,50],
      ['maskDuration','Mask time (ms)','range',50,700,10], ['pageDuration','Page hold (ms)','range',100,2500,50],
      ['flipDuration','Flip time (ms)','range',100,900,20], ['flipDirection','Flip direction','select',['down','up']],
      ['dissolveDuration','Dissolve time (ms)','range',150,1200,10], ['jitter','Dissolve jitter','range',0,14,1],
      ['gap','Loop gap','range',0,120,2], ['maskDirection','Mask direction','select',['top-to-bottom','bottom-to-top','left-to-right','right-to-left']], ['rollDuration','Roll time (ms)','range',80,1200,20],['rollDirection','Roll direction','select',['up','down']],['items','Rolling items','text'], ['pauseOnHover','Pause on hover','checkbox']
    ],
    cardGlow: [
      ['preset','Glow','select',['spotlight','pointer','border','comet','aurora','shine']], ['color','Color','color'],
      ['cycleDuration','Cycle (s)','range',1,12,0.5],
      ['radius','Radius','range',20,360,5], ['opacity','Opacity','range',0,1,0.02], ['blur','Blur','range',0,60,1],
      ['spread','Spread','range',0,100,1], ['follow','Follow','range',0.02,1,0.02], ['sensitivity','Sensitivity','range',0.1,3,0.05],
      ['surface','Surface reflection','checkbox'], ['surfaceOpacity','Surface opacity','range',0,1,0.02], ['surfaceColor','Surface color','color'], ['borderGlow','Luminous border','checkbox'], ['borderColor','Border color','color'], ['borderWidth','Border width','range',1,8,0.5], ['alwaysOn','Always on','checkbox']
    ],
    tilt: [
      ['max','Angle','range',0,30,1], ['maxX','Angle X','range',0,30,1], ['maxY','Angle Y','range',0,30,1],
      ['sensitivity','Sensitivity','range',0.1,3,0.05], ['smoothing','Smoothing','range',0.02,0.5,0.01],
      ['perspective','Perspective','range',300,2000,50], ['scale','Scale','range',1,1.12,0.005], ['reverse','Reverse','checkbox'],
      ['reset','Reset on leave','checkbox'], ['glare','Glare','checkbox'], ['glareOpacity','Glare opacity','range',0,0.8,0.02],
      ['glareRadius','Glare radius','range',20,260,5]
    ],
    magnetic: [['strength','Strength','range',0,1.2,0.05],['radius','Radius','range',20,260,5]],
    ripple: [['color','Color','text'],['duration','Duration (ms)','range',100,1400,20],['opacity','Opacity','range',0,1,0.05],['scale','Scale','range',1,5,0.1],['centered','Centered','checkbox'],['unbounded','Unbounded','checkbox']],
    vibrate: [['preset','Haptic','select',['tap','double-tap','soft','rigid','heavy','success','warning','error','ratchet','heartbeat','long-press']],['trigger','Trigger','select',['hover','click','scroll']],['pattern','Custom pattern','text'],['threshold','Scroll threshold','range',0,500,10]],
    mouseParallax: [['preset','Mode','select',['','compass']],['compassRange','Compass range (deg)','range',0,180,5],['rotateOffset','Rotate offset','range',-180,180,5],['smoothing','Smoothing','range',0.02,0.5,0.01],['sensitivity','Sensitivity','range',0.1,3,0.05],['maxX','Max X','range',0,80,1],['maxY','Max Y','range',0,80,1],['speed','Speed','range',0.02,1,0.02],['global','Global pointer','checkbox']],
    textSplit: [['by','Split by','select',['char','word']],['animation','Animation','select',['rise','fade','wave','spin','flip','scale','blur','slide-up','slide-down']],['duration','Duration','range',0.1,2,0.05],['stagger','Stagger','range',0,0.2,0.005],['delay','Delay','range',0,2,0.05],['hold','Swap hold (ms)','range',400,5000,100],['swapOut','Swap out','select',['slide-up','slide-down','fade','blur','scale','flip','spin']]],
    shuffle: [['speed','Frame speed (ms)','range',10,160,2],['revealRate','Reveal rate','range',1,8,1],['chars','Characters','text']],
    typewriter: [['typeSpeed','Type speed (ms)','range',10,200,5],['eraseSpeed','Erase speed (ms)','range',10,160,5],['pauseAfter','Pause (ms)','range',0,3000,50],['loop','Loop','checkbox'],['caret','Caret (|)','checkbox'],['hangul','한글 조합 타이핑','checkbox']],
    textReveal: [['preset','Mode','select',['stream','char','word','line','bounce','hangul','decode','flicker']],['flickerLoop','Ambient flicker','checkbox'],['loop','Loop','checkbox'],['hold','Loop hold (ms)','range',200,4000,100],['flickerCount','Decode frames','range',1,8,1],['speed','Speed (ms)','range',10,200,5],['stagger','Stagger','range',0,0.2,0.005],['duration','Duration','range',0.1,2,0.05]],
    textTransition: [['preset','Effect','select',['slide-up','rise','fade','blur','scale','clip','dissolve','shimmer']],['jitter','Dissolve jitter','range',0,14,1],['duration','Duration','range',0.1,2,0.05],['pause','Pause (ms)','range',100,4000,100],['blur','Blur','range',0,40,1],['startScale','Start scale','range',0.4,1.4,0.05],['endScale','End scale','range',0.4,1.4,0.05],['charMode','Char mode','checkbox'],['loop','Loop','checkbox']],
    glitch: [['preset','Type','select',['rgb','noise','crt','image']],['sliceCount','Image slices','range',2,16,1],['intensity','Intensity','range',0.1,3,0.05],['speed','Speed','range',0.2,3,0.05],['trigger','Trigger','select',['auto','hover','scroll']],['delay','Burst delay','range',0,3,0.05],['loop','Loop','checkbox']],
    cursor: [['preset','Type','select',['dot','ring','blob','crosshair','text','trail','orbit','snake','sparkle','image','custom']],['color','Color','color'],['dotSize','Dot size','range',1,30,1],['followerSize','Follower size','range',8,120,2],['smoothing','Smoothing','range',0.01,1,0.01],['hoverScale','Hover scale','range',0.5,4,0.1],['pressScale','Press scale','range',0.3,1.5,0.05],['hoverEffect','Hover effect','select',['dot','ring']],['hoverDotSize','Hover dot size','range',6,80,2],['trailCount','Trail count','range',3,16,1],['orbitRadius','Orbit radius','range',20,120,2],['orbitText','Orbit text','text'],['snakeText','Snake text','text'],['rotateText','Rotate text','text'],['mixBlendMode','Blend','select',['normal','difference','screen','multiply']]],
    textFill: [['baseColor','Base color','color'],['fillColor','Fill color','color'],['start','Start','text'],['end','End','text'],['scrub','Scrub','range',0,2,0.1]],
    reveal: [['preset','Preset','select',['fade','fade-up','fade-down','fade-left','fade-right','slide-up','slide-down','slide-left','slide-right','zoom','zoom-in','zoom-out','blur','rise','soft','flip','flip-x','flip-y','rotate','mask','wipe','clock','class']],['startAngle','Clock start (deg)','range',0,360,5],['clockDirection','Clock direction','select',['cw','ccw']],['direction','Direction','select',['up','down','left','right']],['duration','Duration','range',0.1,2.5,0.05],['delay','Delay','range',0,2,0.05],['once','Once','checkbox']],
    scrollVelocity: [['preset','Effect','select',['skew','translate','rotate','scale','combo']],['axis','Axis','select',['x','y']],['distance','Distance','range',0,180,5],['maxSkew','Max skew','range',0,24,1],['maxRotate','Max rotate','range',0,24,1],['maxScale','Max scale','range',0,0.5,0.01],['maxBlur','Max blur','range',0,12,0.25],['smoothing','Smoothing','range',0.01,0.5,0.01],['spring','Spring','checkbox'],['stiffness','Stiffness','range',20,400,5],['damping','Damping','range',1,60,1],['mass','Mass','range',0.1,4,0.1],['reverse','Reverse','checkbox']],
    stickyStack: [['preset','Mode','select',['vertical','horizontal','zindex','floating']],['align','Align','select',['center','top']],['gap','Gap','range',0,80,2],['scrub','Scrub','range',0,2,0.05],['snap','Snap','checkbox'],['effect','Floating effect','select',['depth','fade','scale','slide']],['overlap','Overlap','range',0,0.9,0.05],['previousOpacity','Previous opacity','range',0,1,0.05],['previousScale','Previous scale','range',0.5,1,0.02],['previousBlur','Previous blur','range',0,30,1],['scrollLength','Scroll length','range',20,300,5]],
    slider: [['preset','Effect','select',['slide','coverflow']],['align','Align','select',['center','left']],['gap','Gap','range',0,80,2],['perView','Per view','range',1,2.5,0.05],['speed','Speed','range',0.1,2,0.05],['autoplay','Autoplay (ms)','range',0,6000,250],['rotate','Rotate','range',0,70,1],['depth','Depth','range',0,400,10],['minScale','Side scale','range',0.5,1,0.02]],
    ambientMedia: [['ambientSrc','Image source','text'],['blur','Blur','range',0,100,2],['inset','Inset','range',-80,30,2],['opacity','Opacity','range',0,1,0.02],['saturation','Saturation','range',0,3,0.05],['brightness','Brightness','range',0,2,0.05],['sampleFps','Video FPS','range',2,30,1]],
    lightbox: [['preset','Viewer','select',['viewer','grouped']],['duration','Duration','range',0,1.5,0.05],['backdropOpacity','Backdrop opacity','range',0,1,0.05],['minZoom','Min zoom','range',0.25,1,0.05],['maxZoom','Max zoom','range',1,8,0.25],['zoomStep','Zoom step','range',0.1,1,0.05],['minimap','Minimap','checkbox'],['toolbar','Toolbar','checkbox'],['info','Info','checkbox']],
    marquee: [['direction','Direction','select',['left','right']],['speed','Speed','range',10,200,5],['pauseOnHover','Pause on hover','checkbox'],['reverseOnScrollUp','Reverse on scroll','checkbox'],['scrollAcceleration','Acceleration','range',0,1.5,0.05]],
    parallax: [['axis','Axis','select',['x','y']],['speed','Speed','range',-1,1,0.05],['distance','Distance','range',-300,300,10],['scrub','Scrub','range',0,2,0.1]],
    cssScroll: [['property','CSS property','text'],['start','Start','text'],['end','End','text']],
    scrollSequence: [['fit','Fit','select',['cover','contain']],['scrollLength','Scroll length','text'],['scrub','Scrub','range',0,2,0.1],['preloadRadius','Preload radius','range',0,12,1]],
    brushReveal: [['radius','Brush radius','range',12,200,2],['softness','Softness','range',0,0.95,0.05],['fade','Heal speed','range',0.005,0.3,0.005],['persist','Persist strokes','checkbox'],['blur','Edge blur (px)','range',0,20,1],['opacity','Brush opacity','range',0.1,1,0.05]],
    blurText: [['duration','Duration','range',0.1,2.5,0.05],['stagger','Stagger','range',0,0.2,0.005],['once','Once','checkbox']]
  };

  const DEFAULTS = {
    counter:{duration:1.2,loops:2,popScale:2,popDuration:.3,stagger:.06,format:',',tile:true,tileColor:'#191b20',tileTextColor:'#f6f7fb',gap:3},
    lazy:{duration:1,delay:0,blur:18,skeletonIcon:true,noise:.25,direction:'down',feather:70,pixelStart:.02,pixelEnd:1,pixelStepCount:7,stepDuration:180,holdDuration:0,minDuration:700,startScale:1.12},
    overflowText:{speed:45,delay:600,endPause:800,restartDelay:600,maskDuration:160,pageDuration:900,flipDuration:320,flipDirection:'down',gap:40,pauseOnHover:true},
    cardGlow:{radius:160,opacity:.8,blur:14,spread:0,follow:.18,sensitivity:1,alwaysOn:false,color:'#ff5b1c'},
    tilt:{max:12,sensitivity:1,smoothing:.12,perspective:1000,scale:1.02,reverse:false,reset:true,glare:true,glareOpacity:.22,glareRadius:120},
    magnetic:{strength:.45,radius:120},ripple:{duration:520,opacity:.75,scale:2.6,centered:false,unbounded:false,color:'rgba(255,255,255,.75)'},
    mouseParallax:{maxX:40,maxY:40,speed:.05,global:false},textSplit:{by:'char',animation:'wave',duration:.8,stagger:.035,delay:0},
    shuffle:{speed:34,revealRate:2},typewriter:{typeSpeed:55,eraseSpeed:30,pauseAfter:950,loop:true,caret:true,hangul:false},textReveal:{speed:65,stagger:.04,duration:.8},
    textTransition:{duration:.45,pause:1100,blur:16,startScale:.86,endScale:1.12,charMode:false,loop:true},glitch:{intensity:1.15,delay:.2,speed:1,trigger:'auto',loop:true},
    reveal:{duration:1,delay:0,once:true},scrollVelocity:{axis:'x',distance:90,maxSkew:10,maxRotate:8,maxScale:.08,maxBlur:1.5,smoothing:.1,reverse:false},
    stickyStack:{gap:20,scrub:.8,snap:true,effect:'depth',overlap:.35,previousOpacity:.12,previousScale:.9,previousBlur:8,scrollLength:90},
    slider:{gap:18,perView:1.35,speed:.55,autoplay:0,rotate:42,depth:130,minScale:.82},ambientMedia:{blur:48,inset:-28,opacity:.78,sampleInterval:700},
    lightbox:{duration:.18,backdropOpacity:.82,radius:14,closeOnImage:false},marquee:{direction:'left',speed:70,pauseOnHover:true,reverseOnScrollUp:true,scrollAcceleration:.35},
    parallax:{axis:'y',speed:-.18,distance:100,scrub:1},brushReveal:{radius:80,softness:.55,fade:.045,persist:false,blur:0},scrollSequence:{fit:'cover',scrollLength:'400vh',scrub:1,preloadRadius:3},blurText:{duration:.8,stagger:.025,once:true}
  };


  // Show only the options that actually do something for the current preset.
  const WHEN = {
    counter: {
      loops:(o)=>['slot','digit','flip'].includes(o.preset||'slot'),
      popScale:(o)=>(o.preset)==='pop', popDuration:(o)=>(o.preset)==='pop', popAlign:(o)=>(o.preset)==='pop',
      stagger:(o)=>(o.preset||'slot')!=='plain',
      tile:(o)=>(o.preset)==='flip', tileColor:(o)=>(o.preset)==='flip'&&o.tile!==false, tileTextColor:(o)=>(o.preset)==='flip'&&o.tile!==false, gap:(o)=>(o.preset)==='flip'
    },
    lazy: {
      blur:(o)=>['blur-up','print','dissolve'].includes(o.preset||'fade'),
      noise:(o)=>['print','dissolve'].includes(o.preset), direction:(o)=>(o.preset)==='print', feather:(o)=>(o.preset)==='print',
      steps:(o)=>(o.preset)==='pixelate', stepCount:(o)=>(o.preset)==='pixelate', stepDuration:(o)=>(o.preset)==='pixelate', holdDuration:(o)=>(o.preset)==='pixelate',
      glitchStrength:(o)=>(o.preset)==='flicker', sliceCount:(o)=>(o.preset)==='flicker',
      minDuration:(o)=>(o.preset)==='skeleton', skeletonColor:(o)=>(o.preset)==='skeleton', skeletonHighlight:(o)=>(o.preset)==='skeleton', skeletonIcon:(o)=>(o.preset)==='skeleton',
      startScale:(o)=>(o.preset)==='blur-up'
    },
    overflowText: {
      speed:(o)=>['loop','bounce','rewind','once'].includes(o.preset||'loop'),
      gap:(o)=>(o.preset||'loop')==='loop',
      endPause:(o)=>['bounce','rewind'].includes(o.preset),
      restartDelay:(o)=>['bounce','rewind','page','flip','dissolve','page-roll'].includes(o.preset),
      maskDuration:(o)=>['rewind','page'].includes(o.preset), maskDirection:(o)=>['rewind','page'].includes(o.preset),
      pageDuration:(o)=>['page','flip','dissolve','page-roll'].includes(o.preset),
      flipDuration:(o)=>(o.preset)==='flip', flipDirection:(o)=>(o.preset)==='flip',
      dissolveDuration:(o)=>(o.preset)==='dissolve', jitter:(o)=>(o.preset)==='dissolve',
      rollDuration:(o)=>['rolling','page-roll'].includes(o.preset), rollDirection:(o)=>['rolling','page-roll'].includes(o.preset),
      items:(o)=>(o.preset)==='rolling'
    },
    cursor: {
      dotSize:(o)=>['dot','ring','crosshair','sparkle','text'].includes(o.preset||'dot'),
      followerSize:(o)=>['dot','ring','blob','text'].includes(o.preset||'dot'),
      smoothing:(o)=>!['crosshair','sparkle'].includes(o.preset),
      hoverScale:(o)=>o.hoverEffect==='ring',
      hoverEffect:(o)=>['dot','ring','text'].includes(o.preset||'dot'),
      hoverDotSize:(o)=>['dot','ring','text'].includes(o.preset||'dot')&&o.hoverEffect!=='ring',
      trailCount:(o)=>(o.preset)==='trail', orbitRadius:(o)=>(o.preset)==='orbit', orbitText:(o)=>(o.preset)==='orbit',
      snakeText:(o)=>(o.preset)==='snake', rotateText:(o)=>(o.preset)==='text'
    },
    textReveal: {
      speed:(o)=>['stream','char','word','line','hangul','decode'].includes(o.preset||'stream'),
      stagger:(o)=>['stream','char','word','line','bounce'].includes(o.preset||'stream'),
      duration:(o)=>['bounce','flicker'].includes(o.preset),
      flickerLoop:(o)=>(o.preset)==='flicker',
      loop:(o)=>(o.preset)==='decode', hold:(o)=>(o.preset)==='decode', flickerCount:(o)=>(o.preset)==='decode'
    },
    textTransition: {
      blur:(o)=>(o.preset)==='blur', startScale:(o)=>(o.preset)==='scale', endScale:(o)=>(o.preset)==='scale',
      jitter:(o)=>(o.preset)==='dissolve',
      charMode:(o)=>!['shimmer','dissolve'].includes(o.preset),
      pause:(o)=>(o.preset)!=='shimmer', loop:(o)=>(o.preset)!=='shimmer'
    },
    glitch: { sliceCount:(o)=>(o.preset)==='image', delay:(o)=>(o.preset)!=='image' },
    cardGlow: {
      radius:(o)=>['spotlight','pointer','border'].includes(o.preset||'spotlight'),
      sensitivity:(o)=>['spotlight','pointer','border'].includes(o.preset||'spotlight'),
      follow:(o)=>['spotlight','pointer','border'].includes(o.preset||'spotlight'),
      cycleDuration:(o)=>['comet','aurora','shine'].includes(o.preset),
      surfaceOpacity:(o)=>o.surface===true, surfaceColor:(o)=>o.surface===true,
      borderColor:(o)=>o.borderGlow===true||['comet','border'].includes(o.preset), borderWidth:(o)=>o.borderGlow===true||['comet','border'].includes(o.preset)
    },
    slider: {
      rotate:(o)=>(o.preset||'slide')==='coverflow', depth:(o)=>(o.preset||'slide')==='coverflow', minScale:(o)=>(o.preset||'slide')==='coverflow',
      align:(o)=>(o.preset||'slide')==='slide'
    },
    reveal: {
      direction:(o)=>['wipe','mask','slide-up','slide-down','slide-left','slide-right'].includes(o.preset||'fade-up'),
      startAngle:(o)=>(o.preset)==='clock', clockDirection:(o)=>(o.preset)==='clock'
    },
    stickyStack: {
      effect:(o)=>(o.preset)==='floating', overlap:(o)=>(o.preset)==='floating', previousOpacity:(o)=>(o.preset)==='floating',
      previousScale:(o)=>(o.preset)==='floating', previousBlur:(o)=>(o.preset)==='floating',
      gap:(o)=>(o.preset)==='horizontal', snap:(o)=>(o.preset)==='horizontal',
      scrollLength:(o)=>['floating','horizontal'].includes(o.preset)
    },
    textSplit: { hold:(o)=>o.texts!=null, swapOut:(o)=>o.texts!=null }
  };

  // Friendly Korean explanations shown in the (?) tooltip of each option.
  const HELP = {
    counter: { preset:'카운터 연출 방식. slot=오도미터 롤, plain=숫자 증가, digit=글리프 교체, pop=최종값이 큰 상태로 착지, flip=공항 전광판 플립.', to:'도달할 목표 숫자.', format:'천 단위 콤마 표시 여부.', locale:'숫자 표기 로케일(예: ko-KR).', duration:'전체 애니메이션 시간(초).', loops:'목표 숫자에 도달하기 전에 0-9를 몇 바퀴 돌지.', popScale:'pop에서 글자가 시작하는 크기 배수. 클수록 크게 나타났다 줄어듭니다.', popDuration:'pop에서 글자 하나가 착지하는 시간(초).', popAlign:'pop 착지 기준점. bottom=아래에서 정착, center=제자리 수축, top=위 기준.', stagger:'글자(자릿수)별 시작 시간 간격(초).', prefix:'숫자 앞에 붙는 문자(예: ₩).', suffix:'숫자 뒤에 붙는 문자(예: %).', tile:'flip에서 어두운 타일 배경을 그릴지.', tileColor:'플립 타일 배경색.', tileTextColor:'플립 타일 숫자 색.', gap:'플립 타일 사이 간격(px).' },
    lazy: { preset:'이미지가 로드될 때의 연출. pixelate=픽셀 모자이크, print=스캔 인화, dissolve=노이즈 디졸브, flicker=글리치 점멸, skeleton=자리표시자.', duration:'효과 재생 시간(초).', delay:'로드 완료 후 효과 시작까지 대기(ms).', blur:'시작 블러 강도(px).', noise:'노이즈 오버레이 불투명도(0~1).', direction:'print 스캔 진행 방향.', feather:'print 경계의 부드러움(%).', steps:'픽셀 블록 크기 배열(px). 예: [72,48,24,8,1]', stepCount:'자동 생성할 픽셀 단계 수.', stepDuration:'단계별 시간(ms). 0이면 duration을 균등 분배.', holdDuration:'마지막 픽셀 단계 유지 시간(ms).', minDuration:'스켈레톤 최소 표시 시간(ms). 너무 빨리 사라지는 것 방지.', skeletonColor:'스켈레톤 배경색.', skeletonHighlight:'시머(쓸림) 하이라이트 색.', skeletonIcon:'가운데 이미지 아이콘 표시 여부.', startScale:'blur-up 시작 배율.', glitchStrength:'flicker 슬라이스 어긋남 강도.', sliceCount:'flicker 가로 슬라이스 개수.' },
    overflowText: { preset:'넘치는 텍스트 처리 방식. loop=연속 마퀴, bounce=왕복, rewind=끝나면 처음으로, page=구간 교체, flip=플립 전환, dissolve=노이즈 디졸브, page-roll=구간 세로 롤, rolling=아이템 롤링.', speed:'이동 속도(px/초).', delay:'시작 전 대기(ms).', endPause:'끝에 도달했을 때 머무는 시간(ms).', restartDelay:'한 사이클이 끝나고 다시 시작하기 전 대기(ms).', maskDuration:'마스크 전환 시간(ms).', pageDuration:'각 구간을 보여주는 시간(ms).', flipDuration:'플립 한 번에 걸리는 시간(ms).', flipDirection:'플립이 넘어가는 방향.', dissolveDuration:'글자가 흩어지고 재조립되는 시간(ms).', jitter:'디졸브 시 글자가 흔들리는 최대 거리(px).', rollDuration:'세로 롤 한 번 시간(ms).', rollDirection:'롤 방향(위/아래).', gap:'loop에서 반복 텍스트 사이 간격(px).', maskDirection:'마스크가 진행되는 방향.', items:'rolling 아이템 배열(JSON 또는 | 구분).', pauseOnHover:'마우스를 올리면 일시정지.' },
    cardGlow: { preset:'글로우 방식. spotlight=포인터 스포트라이트, border=포인터 보더, comet=외곽선을 도는 광선, aurora=카드 밖 회전 할로, shine=스윕 광택.', color:'메인 글로우 색.', cycleDuration:'한 바퀴 도는 시간(초).', radius:'스포트라이트 반경(px).', opacity:'글로우 불투명도.', blur:'글로우 블러(px).', spread:'외곽으로 퍼지는 거리(px).', follow:'포인터 추적 부드러움.', sensitivity:'포인터 반응 감도.', surface:'표면 반사 레이어 켜기.', surfaceOpacity:'표면 반사 불투명도.', surfaceColor:'표면 반사 색.', borderGlow:'포인터를 따라오는 보더 광 켜기.', borderColor:'보더 광 색 1.', borderWidth:'보더 두께(px).', alwaysOn:'호버 없이도 항상 표시.' },
    tilt: { max:'최대 기울기(도).', maxX:'X축(상하 회전) 최대 각도.', maxY:'Y축(좌우 회전) 최대 각도.', sensitivity:'포인터 반응 감도.', smoothing:'기울기 부드러움(작을수록 묵직).', perspective:'원근 거리(px). 작을수록 과장됨.', scale:'호버 시 확대 배율.', reverse:'기울기 방향 반전.', reset:'포인터가 나가면 원위치.', glare:'광택 하이라이트 표시.', glareOpacity:'광택 불투명도.', glareRadius:'광택 반경(px).' },
    magnetic: { strength:'끌려오는 세기(0~1.2).', radius:'반응 시작 거리(px).' },
    ripple: { color:'물결 색.', duration:'퍼지는 시간(ms).', opacity:'시작 불투명도.', scale:'최종 크기 배수.', centered:'클릭 위치 대신 중앙에서 시작.', unbounded:'요소 밖까지 퍼짐.' },
    vibrate: { preset:'이름이 붙은 햅틱 패턴. 웹 진동 API는 세기 조절이 없어 타이밍 조합으로 톡톡·드르륵 질감을 만듭니다.', trigger:'진동 트리거(hover/click/scroll).', pattern:'진동 패턴(ms, 콤마 구분).', threshold:'scroll 트리거 임계값(px).' },
    mouseParallax: { preset:'기본=패럴랙스 이동, compass=포인터를 조준해 회전.', compassRange:'0이면 포인터 조준, 값을 주면 좌우 위치를 이 각도 범위로 매핑.', rotateOffset:'바늘 기본 각도 보정(도).', smoothing:'회전/이동 부드러움.', sensitivity:'반응 감도.', maxX:'X축 최대 이동(px).', maxY:'Y축 최대 이동(px).', speed:'이동 반응 속도.', global:'요소 밖 포인터에도 반응.' },
    textSplit: { by:'분해 단위(글자/단어).', animation:'등장 애니메이션. spin/flip은 3D 회전.', duration:'글자당 애니메이션 시간(초).', stagger:'글자 간 시작 간격(초).', delay:'시작 지연(초).', hold:'swap에서 문장 유지 시간(ms).', swapOut:'swap에서 이전 문장이 빠지는 방식.' },
    shuffle: { speed:'스크램블 프레임 간격(ms).', revealRate:'몇 프레임마다 한 글자씩 확정할지.', chars:'스크램블에 사용할 문자들.' },
    typewriter: { typeSpeed:'타이핑 간격(ms).', eraseSpeed:'지우기 간격(ms).', pauseAfter:'문장 완성 후 대기(ms).', loop:'문장 배열 반복.', caret:'커서(|) 표시.', hangul:'한글 자음·모음 조합 과정을 그대로 타이핑.' },
    textReveal: { preset:'stream=아래에서 스르륵, bounce=탄성, hangul=자모 조합, decode=랜덤 글리프 후 확정, flicker=기계식 점멸.', speed:'글자 진행 간격(ms).', stagger:'글자 간 시작 간격(초).', duration:'글자당 시간(초).', flickerLoop:'완성 후에도 이따금 잔플리커.', loop:'decode 반복.', hold:'decode 반복 전 유지 시간(ms).', flickerCount:'확정 전 랜덤 글리프 프레임 수.' },
    textTransition: { preset:'문장 교체 방식. dissolve=노이즈, shimmer=그라디언트 흐름.', duration:'전환 시간(초).', pause:'문장 유지 시간(ms).', blur:'blur 효과의 블러 강도(px).', startScale:'scale 등장 시작 배율.', endScale:'scale 퇴장 배율.', jitter:'dissolve 흔들림 거리(px).', charMode:'글자 단위로 개별 전환.', loop:'마지막 문장 후 처음으로.' },
    glitch: { preset:'rgb=색상 분리 슬라이스, noise=문자 스크램블, crt=아날로그 지terrupt, image=이미지 글리치 버스트.', intensity:'글리치 강도.', speed:'버스트 빈도/속도 배수.', trigger:'auto=자동 반복, hover=올렸을 때, scroll=보일 때.', delay:'첫 버스트까지 대기(초).', loop:'반복 여부.', sliceCount:'image 모드 슬라이스 수.' },
    reveal: { preset:'뷰포트 진입 시 등장 방식. clock=시계 채움 마스크.', direction:'wipe/mask/slide의 진행 방향.', duration:'등장 시간(초).', delay:'지연(초).', once:'한 번만 실행.', startAngle:'clock 시작 각도(도).', clockDirection:'clock 진행 방향(시계/반시계).' },
    scrollVelocity: { preset:'스크롤 속도 반응 방식.', axis:'이동 축.', distance:'최대 이동(px).', maxSkew:'최대 기울임(도).', maxRotate:'최대 회전(도).', maxScale:'최대 스케일 변화.', maxBlur:'최대 모션 블러(px).', smoothing:'감쇠 부드러움.', spring:'스프링 물리 사용.', stiffness:'스프링 강성.', damping:'스프링 감쇠.', mass:'스프링 질량.', reverse:'방향 반전.' },
    stickyStack: { preset:'vertical=카드 스택, horizontal=가로 핀 스크롤, floating=핀 시퀀스.', align:'핀 위치 — center는 뷰포트 세로 중앙, top은 상단 고정.', gap:'가로 모드 카드 간격(px).', scrub:'스크롤 동기화 지연.', snap:'카드 단위 스냅.', effect:'floating 등장 효과.', overlap:'다음 카드가 겹쳐 들어오는 비율.', previousOpacity:'이전 카드가 남는 불투명도.', previousScale:'이전 카드 축소 배율.', previousBlur:'이전 카드 블러(px).', scrollLength:'구간 스크롤 길이.' },
    slider: { preset:'slide=평면, coverflow=3D.', align:'slide에서 활성 슬라이드 정렬(중앙/왼쪽).', gap:'슬라이드 간격(px).', perView:'한 화면에 보이는 슬라이드 수.', speed:'전환 속도.', autoplay:'자동 재생 간격(ms). 0=끔.', rotate:'coverflow 회전 각도.', depth:'coverflow 깊이(px).', minScale:'사이드 슬라이드 최소 배율.', smoothing:'스프링 감쇠(작을수록 부드럽고 느림).' },
    ambientMedia: { ambientSrc:'글로우에 사용할 이미지(비우면 자동).', blur:'주변광 블러(px).', inset:'미디어보다 얼마나 크게 퍼질지(px, 음수=바깥).', opacity:'주변광 불투명도.', saturation:'채도 배수.', brightness:'밝기 배수.', sampleFps:'비디오 샘플링 fps.' },
    lightbox: { preset:'뷰어 형태.', duration:'열림/닫힘 시간(초).', backdropOpacity:'배경 어둡기.', minZoom:'최소 줌.', maxZoom:'최대 줌.', zoomStep:'줌 버튼 한 번당 변화량.', minimap:'줌 시 미니맵 표시.', toolbar:'상단 툴바 표시.', info:'하단 메타데이터 표시.' },
    loader: { renderUI:'UI 전체를 직접 그리는 훅 — (el, opts)에서 {root, render(percent)}를 반환하면 내장 비주얼을 완전히 대체합니다.', className:'오버레이 루트에 붙일 커스텀 클래스.', preset:'slot=숫자 카운터, circular=원형 진행률, bar=수평 바.', minDuration:'최소 표시 시간(ms).', duration:'퇴장 시간(초).', color:'진행 색(--mk-loader-color).', trackColor:'트랙 색.', size:'원형 지름(px).', stroke:'원형 두께(px).', showPercent:'퍼센트 숫자 표시.', barWidth:'바 폭(px).', barHeight:'바 높이(px).', label:'바 상단 라벨.' },
    marquee: { direction:'흐르는 방향.', speed:'속도(px/초).', pauseOnHover:'호버 시 정지.', reverseOnScrollUp:'스크롤 방향에 따라 역재생.', scrollAcceleration:'스크롤 속도 가속 반영률.' },
    parallax: { axis:'이동 축.', speed:'스크롤 대비 속도(음수=반대).', distance:'최대 이동(px).', scrub:'스크롤 동기화 지연.' },
    cssScroll: { property:'진행률을 쓸 CSS 변수 이름.', start:'시작 지점(ScrollTrigger 문법).', end:'끝 지점.' },
    scrollSequence: { fit:'프레임 맞춤 방식.', scrollLength:'시퀀스 전체 스크롤 길이.', scrub:'스크롤 동기화 지연.', preloadRadius:'현재 프레임 주변 미리 로드 수.' },
    blurText: { duration:'글자당 시간(초).', stagger:'글자 간 간격(초).', once:'한 번만 실행.' },
    textFill: { baseColor:'채워지기 전 색.', fillColor:'채워진 색.', start:'시작 지점.', end:'끝 지점.', scrub:'스크롤 동기화 지연.' },
    brushReveal: { opacity:'브러시 불투명도(기본 1=불투명).', radius:'브러시 반경(px).', softness:'가장자리 퍼짐(0=딱딱, 1=에어브러시).', fade:'손을 뗀 뒤 원래대로 아무는 속도.', persist:'칠한 자국을 지우지 않고 유지.', blur:'브러시 가장자리 추가 블러(px).' }
  };

  const state = { snapshots: new WeakMap(), mounted: false, timers: new WeakMap() };
  const dash = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const camel = (value) => value.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
  const labelize = (value) => value.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
  const parse = (value) => {
    if (value === '' || value === true) return true;
    if (value === 'true') return true;
    if (value === 'false') return false;
    if (value !== null && value !== '' && Number.isFinite(Number(value))) return Number(value);
    try { return JSON.parse(value); } catch (_error) { return value; }
  };
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const normalizeColor = (value, fallback = '#ff5b1c') => {
    const text = String(value || '').trim();
    if (/^#[0-9a-f]{6}$/i.test(text)) return text;
    const rgb = text.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (!rgb) return fallback;
    return `#${rgb.slice(1,4).map((channel) => Number(channel).toString(16).padStart(2,'0')).join('')}`;
  };

  function capture(root = document) {
    Object.values(MODULE_ATTRIBUTES).forEach((attribute) => {
      root.querySelectorAll(`[${attribute}]`).forEach((element) => {
        if (!state.snapshots.has(element)) state.snapshots.set(element, element.cloneNode(true));
      });
    });
  }

  function descriptorOptions(descriptor) {
    if (descriptor.kind === 'loader') return { ...descriptor.options };
    const target = descriptor.targets[0];
    const activation = MODULE_ATTRIBUTES[descriptor.module];
    const options = {};
    if (activation && target.hasAttribute(activation)) {
      const value = target.getAttribute(activation);
      if (value) options.preset = parse(value);
    }
    const allowed = new Set(PUBLIC_OPTIONS[descriptor.module] || []);
    Array.from(target.attributes).forEach((attribute) => {
      if (!attribute.name.startsWith('data-mk-') || attribute.name === activation) return;
      const key = camel(attribute.name.slice(8));
      if (allowed.size && !allowed.has(key)) return;
      options[key] = parse(attribute.value);
    });
    return options;
  }

  function optionValue(descriptor, key) {
    const options = descriptor.kind === 'loader' ? descriptor.options : descriptorOptions(descriptor);
    if (descriptor.kind === 'loader' && key === 'preset') return options.type;
    if (Object.prototype.hasOwnProperty.call(options, key)) return options[key];
    return DEFAULTS[descriptor.module]?.[key] ?? (FIELDS[descriptor.module]?.find((field) => field[0] === key)?.[2] === 'checkbox' ? false : '');
  }

  function discover(host) {
    const candidates = [host, ...host.querySelectorAll('*')];
    const found = [];
    Object.entries(MODULE_ATTRIBUTES).forEach(([module, attribute]) => {
      const targets = candidates.filter((element) => element.hasAttribute?.(attribute));
      if (targets.length) found.push({ module, targets, kind: 'element' });
    });
    return found;
  }

  function restoreElement(element) {
    const snapshot = state.snapshots.get(element);
    if (!snapshot) return;
    Array.from(element.attributes).forEach((attribute) => element.removeAttribute(attribute.name));
    Array.from(snapshot.attributes).forEach((attribute) => element.setAttribute(attribute.name, attribute.value));
    if (!['IMG','INPUT','VIDEO','IFRAME','CANVAS'].includes(element.tagName)) element.innerHTML = snapshot.innerHTML;
  }

  function setOption(descriptor, key, value, type) {
    const activation = MODULE_ATTRIBUTES[descriptor.module];
    const attribute = key === 'preset' ? activation : `data-mk-${dash(key)}`;
    descriptor.targets.forEach((target) => {
      if (type === 'checkbox') target.setAttribute(attribute, value ? 'true' : 'false');
      else if (value === '' || value == null) target.removeAttribute(attribute);
      else target.setAttribute(attribute, String(value));
    });
  }

  function apply(host, descriptors, status, message = 'Applied') {
    const MK = window.MotionKit;
    descriptors.forEach((descriptor) => {
      if (descriptor.kind === 'loader') return;
      descriptor.targets.forEach((target) => MK.destroyModule(target, descriptor.module));
      descriptor.targets.forEach((target) => MK.create(descriptor.module, target, descriptorOptions({ ...descriptor, targets: [target] })));
    });
    MK.refresh?.();
    updateCode(host, descriptors);
    status.textContent = `${message} · active instances ${MK.instanceCount}`;
  }

  function replay(host, descriptors, status) {
    const MK = window.MotionKit;
    const loader = descriptors.find((item) => item.kind === 'loader');
    if (loader) {
      runLoader(loader, status);
      return;
    }
    descriptors.forEach((descriptor) => descriptor.targets.forEach((target) => MK.replay(target, descriptor.module, descriptorOptions({ ...descriptor, targets: [target] }))));
    MK.refresh?.();
    status.textContent = `Replayed · active instances ${MK.instanceCount}`;
  }

  function reset(host, descriptors) {
    const MK = window.MotionKit;
    clearTimeout(state.timers.get(host));
    state.timers.delete(host);
    const elementDescriptors = descriptors.filter((descriptor) => descriptor.kind !== 'loader');
    const targets = [...new Set(elementDescriptors.flatMap((descriptor) => descriptor.targets))];

    descriptors.filter((descriptor) => descriptor.kind === 'loader').forEach((descriptor) => {
      Object.keys(descriptor.options).forEach((key) => delete descriptor.options[key]);
      Object.assign(descriptor.options, descriptor.initialOptions);
    });
    elementDescriptors.forEach((descriptor) => descriptor.targets.forEach((target) => MK.destroyModule(target, descriptor.module)));
    targets.forEach(restoreElement);
    elementDescriptors.forEach((descriptor) => descriptor.targets.forEach((target) => {
      MK.create(descriptor.module, target, descriptorOptions({ ...descriptor, targets: [target] }));
    }));

    rebuildPanel(host, descriptors, 'Reset to demo defaults');
    MK.refresh?.();
  }

  function runLoader(descriptor, status) {
    const options = { ...descriptor.options };
    const overlay = document.createElement('div');
    overlay.className = 'mk-demo-loader-overlay';
    overlay.dataset.loaderType = options.type || 'slot';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:10010;background:var(--bg);color:var(--text);';
    document.body.appendChild(overlay);
    let instance;
    instance = window.MotionKit.loader(overlay, { ...options, onComplete: () => { instance?.destroy(); overlay.remove(); } });
    status.textContent = `Running ${options.type || 'slot'} loader`;
  }

  function currentSource(descriptor) {
    if (descriptor.kind === 'loader') {
      const options = JSON.stringify(descriptor.options, null, 2);
      return {
        html: `<button id="show-loader">Run loader</button>`,
        js: `const overlay = document.createElement('div');\noverlay.className = 'loader-overlay';\ndocument.body.appendChild(overlay);\n\nMotionKit.loader(overlay, ${options});`
      };
    }
    const html = descriptor.targets.map((target) => {
      const clean = state.snapshots.get(target)?.cloneNode(true) || target.cloneNode(true);
      const activation = MODULE_ATTRIBUTES[descriptor.module];
      Array.from(target.attributes).filter((attribute) => attribute.name.startsWith('data-mk-')).forEach((attribute) => clean.setAttribute(attribute.name, attribute.value));
      if (activation && target.hasAttribute(activation)) clean.setAttribute(activation, target.getAttribute(activation));
      return clean.outerHTML;
    }).join('\n');
    const options = descriptorOptions(descriptor);
    const selector = `[${MODULE_ATTRIBUTES[descriptor.module]}]`;
    const js = `const element = document.querySelector('${selector}');\nconst instance = MotionKit.${descriptor.module}(element, ${JSON.stringify(options, null, 2)});`;
    return { html, js };
  }

  function combinedSource(descriptors) {
    const sources = descriptors.map(currentSource);
    return {
      html: [...new Set(sources.map((source) => source.html))].join('\n'),
      js: sources.map((source) => source.js).join('\n\n')
    };
  }

  function updateCode(host, descriptors) {
    const panel = host.matches('.mk-playground-host') ? host.querySelector('.mk-playground') : host.querySelector(':scope > .mk-playground');
    if (!panel) return;
    const source = combinedSource(descriptors);
    panel.dataset.htmlCode = source.html;
    panel.dataset.jsCode = source.js;
    const active = (panel.__mkBody || panel).querySelector('.mk-playground__tab.is-active')?.dataset.codeTab || 'html';
    const code = (panel.__mkBody || panel).querySelector('.mk-playground__pre code');
    if (code) code.innerHTML = escapeHtml(active === 'html' ? source.html : source.js);
  }

  function createField(descriptor, definition, host, descriptors, status) {
    const [key, label, type, a, b, c] = definition;
    const wrapper = document.createElement('label');
    wrapper.className = `mk-playground__field${type === 'checkbox' ? ' mk-playground__check' : ''}`;
    const caption = document.createElement('span');
    caption.textContent = label;
    const tip = HELP[descriptor.module]?.[key];
    if (tip) {
      const help = document.createElement('button');
      help.type = 'button';
      help.className = 'mk-help';
      help.setAttribute('aria-label', `${label} 설명`);
      help.dataset.tip = tip;
      help.textContent = '?';
      caption.appendChild(help);
      wrapper.dataset.tip = tip;
    }
    let input;
    if (type === 'select') {
      input = document.createElement('select');
      a.forEach((choice) => {
        const option = document.createElement('option'); option.value = choice; option.textContent = choice || 'none'; input.appendChild(option);
      });
    } else {
      input = document.createElement('input'); input.type = type;
      if (type === 'range') { input.min = a; input.max = b; input.step = c; }
    }
    input.dataset.option = key;
    input.dataset.module = descriptor.module;
    const value = optionValue(descriptor, key);
    if (type === 'checkbox') input.checked = Boolean(value);
    else if (type === 'color') input.value = normalizeColor(value);
    else input.value = value;
    const valueLabel = document.createElement('small');
    valueLabel.className = 'mk-playground__value';
    valueLabel.textContent = type === 'checkbox' ? (input.checked ? 'on' : 'off') : input.value;
    const schedule = () => {
      clearTimeout(state.timers.get(host));
      state.timers.set(host, setTimeout(() => apply(host, descriptors, status), type === 'range' ? 80 : 0));
    };
    input.addEventListener(type === 'range' ? 'input' : 'change', () => {
      const next = type === 'checkbox' ? input.checked : input.value;
      valueLabel.textContent = type === 'checkbox' ? (input.checked ? 'on' : 'off') : input.value;
      if (descriptor.kind === 'loader') descriptor.options[key === 'preset' ? 'type' : key] = type === 'number' || type === 'range' ? Number(next) : next;
      else setOption(descriptor, key, next, type);
      updateCode(host, descriptors);
      schedule();
      if (key === 'preset' || key === 'surface' || key === 'borderGlow' || key === 'tile' || key === 'hoverEffect') {
        setTimeout(() => rebuildPanel(host, descriptors, '프리셋에 맞는 옵션만 표시합니다', true), 120);
      }
    });
    if (type === 'checkbox') { wrapper.append(input, caption, valueLabel); }
    else { wrapper.append(caption, input, valueLabel); }
    return wrapper;
  }

  function panelFor(host, descriptors) {
    const details = document.createElement('details');
    details.className = 'mk-playground';
    const summary = document.createElement('summary');
    const moduleNames = descriptors.map((item) => item.module === 'loader' ? 'Loader' : labelize(item.module)).join(' + ');
    summary.innerHTML = `<span class="mk-playground__summary-copy"><span class="mk-playground__badge">LIVE</span> Customize & copy code</span><span>${escapeHtml(moduleNames)}</span>`;
    const body = document.createElement('div'); body.className = 'mk-playground__body';
    const groups = document.createElement('div'); groups.className = 'mk-playground__groups';
    const status = document.createElement('div'); status.className = 'mk-playground__status'; status.setAttribute('aria-live','polite');

    descriptors.forEach((descriptor) => {
      const fieldset = document.createElement('fieldset'); fieldset.className = 'mk-playground__group';
      const legend = document.createElement('legend'); legend.className = 'mk-playground__legend'; legend.textContent = descriptor.module === 'loader' ? 'Loader' : labelize(descriptor.module);
      const controls = document.createElement('div'); controls.className = 'mk-playground__controls';
      const currentOptions = descriptor.kind === 'loader' ? { preset: descriptor.options.type, ...descriptor.options } : { ...(DEFAULTS[descriptor.module] || {}), ...descriptorOptions(descriptor) };
      const definitions = descriptor.kind === 'loader' ? [
        ['preset','Type','select',['slot','circular','bar']],['minDuration','Minimum (ms)','range',300,4000,100],['duration','Exit duration','range',0.1,1.5,0.05],
        ['color','Color','color'],['trackColor','Track color','color'],['size','Circle size','range',48,220,4],['stroke','Stroke','range',2,18,1],
        ['showPercent','Show percent','checkbox'],['barWidth','Bar width','range',120,620,10],['barHeight','Bar height','range',2,24,1],['label','Label','text']
      ] : (FIELDS[descriptor.module] || []);
      definitions.filter((definition) => {
        const rule = WHEN[descriptor.module]?.[definition[0]];
        try { return !rule || rule(currentOptions); } catch (_e) { return true; }
      }).forEach((definition) => controls.appendChild(createField(descriptor, definition, host, descriptors, status)));
      fieldset.append(legend, controls); groups.appendChild(fieldset);
    });

    const toolbar = document.createElement('div'); toolbar.className = 'mk-playground__toolbar';
    const replayButton = document.createElement('button'); replayButton.type = 'button'; replayButton.className = 'is-primary'; replayButton.textContent = descriptors.some((item) => item.kind === 'loader') ? 'Run' : 'Replay';
    const applyButton = document.createElement('button'); applyButton.type = 'button'; applyButton.textContent = 'Apply';
    const resetButton = document.createElement('button'); resetButton.type = 'button'; resetButton.textContent = 'Reset';
    replayButton.addEventListener('click', () => replay(host, descriptors, status));
    applyButton.addEventListener('click', () => apply(host, descriptors, status));
    resetButton.addEventListener('click', () => reset(host, descriptors));
    toolbar.append(replayButton, applyButton, resetButton);

    const codeWrap = document.createElement('div'); codeWrap.className = 'mk-playground__code';
    codeWrap.innerHTML = `<div class="mk-playground__code-head"><div class="mk-playground__tabs"><button type="button" class="mk-playground__tab is-active" data-code-tab="html">HTML</button><button type="button" class="mk-playground__tab" data-code-tab="js">JS</button></div><button type="button" class="mk-playground__copy">Copy</button></div><pre class="mk-playground__pre"><code></code></pre>`;
    codeWrap.querySelectorAll('[data-code-tab]').forEach((tab) => tab.addEventListener('click', () => {
      codeWrap.querySelectorAll('[data-code-tab]').forEach((item) => item.classList.toggle('is-active', item === tab));
      updateCode(host, descriptors);
    }));
    codeWrap.querySelector('.mk-playground__copy').addEventListener('click', async (event) => {
      const copyButton = event.currentTarget;
      const active = codeWrap.querySelector('.mk-playground__tab.is-active').dataset.codeTab;
      const text = details.dataset[active === 'html' ? 'htmlCode' : 'jsCode'] || '';
      try {
        await navigator.clipboard.writeText(text);
      } catch (_error) {
        const textarea = document.createElement('textarea'); textarea.value = text; document.body.appendChild(textarea); textarea.select(); document.execCommand('copy'); textarea.remove();
      }
      copyButton.textContent = 'Copied'; status.textContent = `${active.toUpperCase()} copied`;
      setTimeout(() => { copyButton.textContent = 'Copy'; }, 1000);
    });

    // Options open in a fixed side drawer so cards never stretch the grid.
    const drawerHead = document.createElement('div');
    drawerHead.className = 'mk-playground__drawer-head';
    const drawerTitle = document.createElement('strong');
    drawerTitle.textContent = moduleNames;
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'mk-playground__close';
    closeButton.setAttribute('aria-label', '옵션 닫기');
    closeButton.textContent = '✕';
    closeButton.addEventListener('click', () => { details.open = false; });
    drawerHead.append(drawerTitle, closeButton);
    body.prepend(drawerHead);
    details.__mkBody = body;
    details.addEventListener('toggle', () => {
      if (details.open) {
        document.querySelectorAll('.mk-playground[open]').forEach((other) => { if (other !== details) other.open = false; });
        // Portal: fixed positioning breaks inside transformed ancestors
        // (tilted cards), so the drawer always mounts on <body>.
        document.body.appendChild(body);
        body.classList.add('is-portal');
      } else {
        body.classList.remove('is-portal');
        details.appendChild(body);
      }
    });
    body.append(groups, toolbar, codeWrap, status); details.append(summary, body);
    return details;
  }

  function rebuildPanel(host, descriptors, message = '', keepOpen = false) {
    const previous = host.querySelector(':scope > .mk-playground');
    const wasOpen = keepOpen || previous?.open;
    previous?.__mkBody?.remove();
    previous?.remove();
    const panel = panelFor(host, descriptors);
    if (wasOpen) panel.open = true;
    host.appendChild(panel);
    updateCode(host, descriptors);
    if (message) (panel.__mkBody || panel).querySelector('.mk-playground__status').textContent = message;
  }

  function mountHost(host, descriptors) {
    if (!descriptors.length || host.dataset.playgroundMounted === 'true') return;
    let controlHost = host;
    if (!host.classList.contains('card') && !host.classList.contains('mk-playground-host')) {
      controlHost = document.createElement('div');
      controlHost.className = 'mk-playground-host';
      host.insertAdjacentElement('afterend', controlHost);
    }
    controlHost.dataset.playgroundMounted = 'true';
    rebuildPanel(controlHost, descriptors);
  }

  function mount(root = document) {
    if (state.mounted) return;
    state.mounted = true;
    // Replay as a floating icon on the stage's bottom-left corner.
    root.querySelectorAll('.card .replay-row [data-action="replay-parent"], .card .replay-row [data-action="replay"]').forEach((button) => {
      const card = button.closest('.card');
      const stage = card?.querySelector('.demo-stage, .reveal-demo-card');
      if (!stage) return;
      const row = button.closest('.replay-row');
      button.classList.add('replay-fab');
      button.textContent = '↺';
      button.setAttribute('aria-label', 'Replay');
      button.title = 'Replay';
      stage.appendChild(button);
      if (row && !row.children.length) row.remove();
    });
    root.querySelectorAll('.card').forEach((card) => {
      let descriptors = discover(card);
      const loaderButton = card.querySelector('[data-loader-type]');
      if (loaderButton) {
        const type = loaderButton.dataset.loaderType;
        const options = { type, minDuration: 1100, duration: .45, color: '#ff5b1c', trackColor: '#dfe3ea', size: 104, stroke: 8, showPercent: true, barWidth: 320, barHeight: 8, label: type === 'bar' ? 'Loading assets' : '' };
        const loaderDescriptor = { module: 'loader', targets: [], kind: 'loader', options, initialOptions: { ...options } };
        descriptors = [loaderDescriptor];
        loaderButton.addEventListener('click', (event) => {
          event.preventDefault();
          const status = card.querySelector('.mk-playground__status') || { textContent: '' };
          runLoader(loaderDescriptor, status);
        });
      }
      mountHost(card, descriptors);
    });

    root.querySelectorAll('[data-mk-sticky-stack],[data-mk-marquee],[data-mk-scroll-sequence]').forEach((element) => {
      if (element.closest('.card') || element.nextElementSibling?.classList.contains('mk-playground-host')) return;
      mountHost(element, discover(element));
    });

    const notice = document.createElement('div');
    notice.className = 'playground-notice';
    notice.innerHTML = '<div><strong>Live playground</strong><span>각 데모의 Customize를 열어 옵션을 바꾸고 HTML/JS 코드를 복사할 수 있습니다.</span></div><code>Replay · Reset · Copy</code>';
    document.querySelector('.hero-inner')?.appendChild(notice);
  }

  window.MotionKitPlayground = { capture, mount, updateCode, publicOptions: PUBLIC_OPTIONS };
})();
