const math = {
    lerp: (a, b, n) => {
      return (1 - n) * a + n * b;
    },
    norm: (value, min, max) => {
      return (value - min) / (max - min);
    } };
  
  
  const config = {
    height: window.innerHeight,
    width: window.innerWidth };
  
  
  class Smooth {
    constructor() {
      this.bindAll();
  
      this.el = document.querySelector('[data-scroll]');
      this.content = [...document.querySelectorAll('[data-scroll-content]')];
  
      this.dom = {
        el: this.el,
        content: this.content,
        elems: [[...this.content[0].querySelectorAll('.js-slide')], [...this.content[1].querySelectorAll('.js-slide')]],
        handle: this.el.querySelector('.js-scrollbar__handle') };
  
  
      this.data = {
        total: this.dom.elems[0].length - 1,
        current: 0,
        last: {
          one: 0,
          two: 0 },
  
        on: 0,
        off: 0 };
  
  
      this.bounds = {
        elem: 0,
        content: 0,
        width: 0,
        max: 0,
        min: 0 };
  
  
      this.state = {
        dragging: false };
  
  

  
      this.init();
    }
  
    bindAll() {
      ['scroll', 'run', 'resize'].
      forEach(fn => this[fn] = this[fn].bind(this));
    }
  
    setStyles() {
      this.dom.el.style.position = 'fixed';
      this.dom.el.style.top = 0;
      this.dom.el.style.left = 0;
      this.dom.el.style.height = '100%';
      this.dom.el.style.width = '100%';
      this.dom.el.style.overflow = 'hidden';
    }
  
    setBounds(elems) {
      let w = 0;
  
      elems.forEach((el, index) => {
        const bounds = el.getBoundingClientRect();
  
        el.style.position = 'absolute';
        el.style.top = 0;
        el.style.left = `${w}px`;
  
        w = w + bounds.width * 0.9;
  
        this.bounds.width = w;
        this.bounds.max = this.bounds.width - config.width;
  
        if (this.data.total === index && elems === this.dom.elems[0]) {
          this.dom.content[0].style.width = `${w}px`;
          this.dom.content[1].style.width = `${w}px`;
          document.body.style.height = `${w}px`;
        }
      });
    }
  
    resize() {
      this.setBounds(this.dom.elems[0]);
      this.setBounds(this.dom.elems[1]);
      this.scroll();
    }
  
    preload() {
      imagesLoaded(this.dom.content, instance => {
        this.setBounds(this.dom.elems[0]);
        this.setBounds(this.dom.elems[1]);
      });
    }
  
    scroll() {
      if (this.state.dragging) return;
  
      this.data.current = window.scrollY;
      this.clamp();
    }
  
    run() {
      this.data.last.one = math.lerp(this.data.last.one, this.data.current, 0.085);
      this.data.last.one = Math.floor(this.data.last.one * 100) / 100;
  
      this.data.last.two = math.lerp(this.data.last.two, this.data.current, 0.08);

  
      const diff = this.data.current - this.data.last.one;
      const acc = diff / config.width;
      const velo = +acc;
      const skew = velo * 7.5;
  
      this.dom.content[0].style.transform = `translate3d(-${this.data.last.one.toFixed(2)}px, 0, 0)  skewX(${skew}deg)`;
      this.dom.content[1].style.transform = `translate3d(-${this.data.last.two.toFixed(2)}px, 0, 0) `;
  
      const scale = math.norm(this.data.last.two, 0, this.bounds.max);
  
      this.dom.handle.style.transform = `scaleX(${scale})`;
  
      this.requestAnimationFrame();
    }
  
    on() {
      this.setStyles();
      this.setBounds(this.dom.elems[0]);
      this.setBounds(this.dom.elems[1]);
      this.addEvents();
  
      this.requestAnimationFrame();
    }
  
    requestAnimationFrame() {
      this.rAF = requestAnimationFrame(this.run);
    }
  
    addEvents() {
      window.addEventListener('scroll', this.scroll, { passive: true });
    }
  
    init() {
      this.preload();
      this.on();
    }}
  
  
  
 
  
  
  // Init classes
  const smooth = new Smooth();
  const transition = new Transition();

  
 
