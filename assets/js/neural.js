(function () {
  // ═══════════════════════════════════════════════════
  //  NEURAL NETWORK BACKGROUND — CRAZY MODE
  //  Neurons + Synapses + Firing pulses + Data streams
  //  Mouse/click events on WINDOW (not canvas)
  //  so ALL page elements stay fully interactive
  // ═══════════════════════════════════════════════════

  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, neurons = [], pulses = [], dataStreams = [];
  let mouse = { x: -9999, y: -9999 };
  let frame = 0;

  const CFG = {
    neuronCount: 88,
    maxDist:     185,
    neuronRadius:{ min: 1.5, max: 4.5 },
    colors:['#00e0ff','#9b59ff','#ffaa00','#00e676','rgba(255,255,255,0.7)'],
    streamCount: 14,
  };

  /* ── resize ─────────────────────────────── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', () => { resize(); init(); });
  resize();

  /* ── helpers ────────────────────────────── */
  function hexToRgba(hex, a) {
    if (!hex) return `rgba(0,224,255,${a})`;
    if (hex.startsWith('rgba(')) {
      return hex.replace(/[\d.]+\)$/, `${a})`);
    }
    if (hex.startsWith('rgb(')) {
      return hex.replace('rgb(','rgba(').replace(')',`,${a})`);
    }
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function rand(mn,mx){ return mn + Math.random()*(mx-mn); }

  /* ── Neuron ──────────────────────────────── */
  class Neuron {
    constructor(){ this.reset(); }
    reset(){
      this.x  = rand(0, W);
      this.y  = rand(0, H);
      this.vx = (Math.random()-0.5)*0.42;
      this.vy = (Math.random()-0.5)*0.42;
      this.r  = rand(CFG.neuronRadius.min, CFG.neuronRadius.max);
      this.color     = CFG.colors[Math.floor(Math.random()*CFG.colors.length)];
      this.baseAlpha = rand(0.35, 0.80);
      this.alpha     = this.baseAlpha;
      this.pulseT    = rand(0, Math.PI*2);
      this.fired     = false;
      this.fireT     = 0;
      this.ring      = 0;
    }
    fire(){
      if (this.fired) return;
      this.fired = true; this.fireT = 0; this.ring = 0;
    }
    update(){
      this.x += this.vx; this.y += this.vy;
      if (this.x<0||this.x>W) this.vx*=-1;
      if (this.y<0||this.y>H) this.vy*=-1;

      // gentle mouse attraction
      const dx=mouse.x-this.x, dy=mouse.y-this.y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<150){ this.vx+=dx/d*0.045; this.vy+=dy/d*0.045; }
      const spd=Math.sqrt(this.vx*this.vx+this.vy*this.vy);
      if(spd>1.6){ this.vx/=spd*0.65; this.vy/=spd*0.65; }

      this.pulseT+=0.028;
      this.alpha = this.baseAlpha + Math.sin(this.pulseT)*0.22;
      if(this.fired){ this.fireT++; this.ring=this.fireT*2.4;
        if(this.fireT>28){ this.fired=false; this.ring=0; } }
    }
    draw(){
      if(this.fired){
        const fa=Math.max(0,1-this.fireT/28);
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r+this.ring,0,Math.PI*2);
        ctx.strokeStyle=hexToRgba(this.color,fa*0.55);
        ctx.lineWidth=1.2; ctx.stroke();
        // second outer ring
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.r+this.ring*0.6,0,Math.PI*2);
        ctx.strokeStyle=hexToRgba(this.color,fa*0.25);
        ctx.lineWidth=0.7; ctx.stroke();
      }
      // glow halo
      const grd=ctx.createRadialGradient(this.x,this.y,0,this.x,this.y,this.r*5);
      grd.addColorStop(0, hexToRgba(this.color, this.alpha*0.45));
      grd.addColorStop(1, hexToRgba(this.color, 0));
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r*5,0,Math.PI*2);
      ctx.fillStyle=grd; ctx.fill();
      // core dot
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=hexToRgba(this.color,this.alpha);
      ctx.fill();
      // bright centre
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r*0.35,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${this.alpha*0.7})`;
      ctx.fill();
    }
  }

  /* ── Pulse (travelling signal) ───────────── */
  class Pulse {
    constructor(from,to){
      this.from=from; this.to=to; this.t=0;
      this.color=from.color;
      this.speed=rand(0.010,0.022);
      this.size=rand(2.2,4);
    }
    update(){ this.t+=this.speed; }
    done(){ return this.t>=1; }
    draw(){
      const ease=t=>t<0.5?2*t*t:(4-2*t)*t-1;
      const et=ease(Math.min(this.t,0.9999));
      const x=this.from.x+(this.to.x-this.from.x)*et;
      const y=this.from.y+(this.to.y-this.from.y)*et;
      const a=Math.sin(this.t*Math.PI);
      // trail
      for(let i=1;i<=6;i++){
        const tt=Math.max(0,this.t-i*0.03);
        const et2=ease(tt);
        const tx=this.from.x+(this.to.x-this.from.x)*et2;
        const ty=this.from.y+(this.to.y-this.from.y)*et2;
        ctx.beginPath();
        ctx.arc(tx,ty,this.size*(1-i/7),0,Math.PI*2);
        ctx.fillStyle=hexToRgba(this.color, a*(1-i/7)*0.45);
        ctx.fill();
      }
      // head glow
      const g=ctx.createRadialGradient(x,y,0,x,y,this.size*2.5);
      g.addColorStop(0, hexToRgba(this.color, a*0.7));
      g.addColorStop(1, hexToRgba(this.color, 0));
      ctx.beginPath(); ctx.arc(x,y,this.size*2.5,0,Math.PI*2);
      ctx.fillStyle=g; ctx.fill();
      // bright core
      ctx.beginPath(); ctx.arc(x,y,this.size,0,Math.PI*2);
      ctx.fillStyle=hexToRgba(this.color,a); ctx.fill();
      ctx.beginPath(); ctx.arc(x,y,this.size*0.38,0,Math.PI*2);
      ctx.fillStyle=`rgba(255,255,255,${a*0.9})`; ctx.fill();
    }
  }

  /* ── DataStream (matrix rain) ────────────── */
  class DataStream {
    constructor(){ this.reset(true); }
    reset(init){
      this.x    =rand(0,W);
      this.y    =init?rand(-H,0):-rand(20,80);
      this.speed=rand(0.55,1.6);
      this.chars=Array.from({length:20},()=>this.rc());
      this.timer=0;
      this.alpha=rand(0.04,0.10);
      this.color=Math.random()>0.5?'#00e0ff':'#00e676';
      this.size =rand(9,12);
    }
    rc(){
      return '01アイウエカキMLOPS∇λΣΘ∂≈≡βαΔ'[Math.floor(Math.random()*30)];
    }
    update(){
      this.y+=this.speed; this.timer++;
      if(this.timer%5===0){ this.chars.pop(); this.chars.unshift(this.rc()); }
      if(this.y>H+320) this.reset(false);
    }
    draw(){
      ctx.font=`${this.size}px "JetBrains Mono",monospace`;
      this.chars.forEach((ch,i)=>{
        const fade=1-i/this.chars.length;
        const bright=i===0?2:1;
        ctx.fillStyle=hexToRgba(this.color, this.alpha*fade*bright);
        ctx.fillText(ch,this.x,this.y-i*13);
      });
    }
  }

  /* ── synapse ─────────────────────────────── */
  function drawSynapse(a,b,dist){
    const al=(1-dist/CFG.maxDist)*0.38;
    const grd=ctx.createLinearGradient(a.x,a.y,b.x,b.y);
    grd.addColorStop(0,   hexToRgba(a.color, al));
    grd.addColorStop(0.5, hexToRgba('#00e0ff', al*1.5));
    grd.addColorStop(1,   hexToRgba(b.color, al));
    ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
    ctx.strokeStyle=grd;
    ctx.lineWidth=0.5+(1-dist/CFG.maxDist)*0.9;
    ctx.stroke();
  }

  /* ── fire helper ─────────────────────────── */
  function fireFrom(src, radius, maxPulses){
    src.fire();
    let count=0;
    const sorted=[...neurons].filter(n=>n!==src).sort((a,b)=>{
      return Math.hypot(a.x-src.x,a.y-src.y)-Math.hypot(b.x-src.x,b.y-src.y);
    });
    sorted.forEach(n=>{
      if(count>=maxPulses) return;
      const d=Math.hypot(n.x-src.x,n.y-src.y);
      if(d<radius){
        pulses.push(new Pulse(src,n));
        setTimeout(()=>n.fire(), d*2.2);
        count++;
      }
    });
  }

  /* ── INIT ───────────────────────────────── */
  function init(){
    neurons    = Array.from({length:CFG.neuronCount},()=>new Neuron());
    pulses     = [];
    dataStreams = Array.from({length:CFG.streamCount},()=>new DataStream());
  }

  /* ── auto fire ──────────────────────────── */
  let nextFire=80;
  function autoFire(){
    if(frame<nextFire) return;
    nextFire=frame+rand(25,75);
    const src=neurons[Math.floor(Math.random()*neurons.length)];
    fireFrom(src, CFG.maxDist*0.75, 5);
  }

  /* ── WINDOW-level events (canvas is none) ── */
  window.addEventListener('mousemove', e=>{
    mouse.x=e.clientX; mouse.y=e.clientY;
    // fire neurons close to cursor
    neurons.forEach(n=>{
      if(Math.hypot(n.x-mouse.x,n.y-mouse.y)<55) fireFrom(n,CFG.maxDist*0.65,3);
    });
  });

  window.addEventListener('click', e=>{
    // big burst on click anywhere
    const src=[...neurons].sort((a,b)=>
      Math.hypot(a.x-e.clientX,a.y-e.clientY)-Math.hypot(b.x-e.clientX,b.y-e.clientY)
    )[0];
    fireFrom(src, CFG.maxDist*1.4, 18);
    // ripple ring on click point
    ripples.push({x:e.clientX, y:e.clientY, r:0, alpha:0.7});
  });

  /* ── ripple effects on click ────────────── */
  let ripples=[];

  function drawRipples(){
    ripples=ripples.filter(rp=>rp.alpha>0.02);
    ripples.forEach(rp=>{
      rp.r  +=4;
      rp.alpha*=0.92;
      ctx.beginPath(); ctx.arc(rp.x,rp.y,rp.r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,224,255,${rp.alpha})`;
      ctx.lineWidth=1.5; ctx.stroke();
      // second ring
      if(rp.r>20){
        ctx.beginPath(); ctx.arc(rp.x,rp.y,rp.r*0.55,0,Math.PI*2);
        ctx.strokeStyle=`rgba(155,89,255,${rp.alpha*0.5})`;
        ctx.lineWidth=1; ctx.stroke();
      }
    });
  }

  /* ── DRAW LOOP ──────────────────────────── */
  function draw(){
    ctx.clearRect(0,0,W,H);

    // radial bg
    const bg=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.max(W,H)*0.85);
    bg.addColorStop(0,  'rgba(5,18,32,0.97)');
    bg.addColorStop(0.5,'rgba(2,11,20,0.98)');
    bg.addColorStop(1,  'rgba(1,5,10,1)');
    ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

    // data streams
    dataStreams.forEach(s=>{ s.update(); s.draw(); });

    // synapses
    for(let i=0;i<neurons.length;i++)
      for(let j=i+1;j<neurons.length;j++){
        const d=Math.hypot(neurons[i].x-neurons[j].x, neurons[i].y-neurons[j].y);
        if(d<CFG.maxDist) drawSynapse(neurons[i],neurons[j],d);
      }

    // neurons
    neurons.forEach(n=>{ n.update(); n.draw(); });

    // pulses
    pulses=pulses.filter(p=>!p.done());
    pulses.forEach(p=>{ p.update(); p.draw(); });

    // ripples
    drawRipples();

    autoFire();
    frame++;
    requestAnimationFrame(draw);
  }

  init();
  draw();
})();
