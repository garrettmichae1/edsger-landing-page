(() => {
  'use strict';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const reveals = [...document.querySelectorAll('.reveal')];
  if (!reducedMotion.matches && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    reveals.forEach(element => observer.observe(element));
  }
  const demos = [
    {
      source: 'assets/hero.mp4', poster: 'assets/hero-poster.jpg',
      category: 'Coding agent', title: ['An idea.', 'A working project.'],
      summary: 'Watch the agent work through a Python linear regression project, right on the phone.',
      label: 'Dijkstra · powered by DeepSeek', detail: 'Cloud AI · code runs on device',
      description: 'Dijkstra cloud coding agent working on a Python linear regression project'
    },
    {
      source: 'assets/hero-2.mp4', poster: 'assets/hero-2-poster.jpg',
      category: 'Offline chat', title: ['A question.', 'A conversation.'],
      summary: 'See Edsger Mini in a real conversation. Follow your curiosity with AI that runs on your phone.',
      label: 'Edsger Mini · powered by Liquid AI', detail: 'On-device AI · free local chat',
      description: 'Edsger Mini on-device AI in a conversation'
    },
    {
      source: 'assets/hero-3.mp4', poster: 'assets/hero-3-poster.jpg',
      category: 'Your own model', title: ['Your provider.', 'The same workspace.'],
      summary: 'Watch a connected OpenAI model edit and run a Python project using Edsger’s coding tools.',
      label: 'Connected OpenAI model · your API key', detail: 'Cloud AI · provider bills usage separately',
      description: 'Connected OpenAI cloud model editing and running a Python ASCII art project'
    }
  ];
  const video = document.getElementById('product-demo');
  const buttons = [...document.querySelectorAll('[data-demo]')];
  let active = 1;
  let manuallyPaused = false;
  let inView = false;
  let systemPause = false;
  function pauseForSystem() {
    if (video.paused) return;
    systemPause = true;
    video.pause();
  }
  function tryPlay() {
    if (!video || reducedMotion.matches || manuallyPaused || !inView || document.hidden) return;
    const promise = video.play();
    if (promise) promise.catch(() => {});
  }
  function selectDemo(index) {
    if (!video || index === active || !demos[index]) return;
    pauseForSystem();
    active = index;
    const demo = demos[index];
    video.poster = demo.poster;
    video.querySelector('source').src = demo.source;
    video.setAttribute('aria-label', demo.description);
    document.getElementById('demo-category').textContent = demo.category;
    document.getElementById('demo-title').replaceChildren(document.createTextNode(demo.title[0]), document.createElement('br'), document.createTextNode(demo.title[1]));
    document.getElementById('demo-summary').textContent = demo.summary;
    const small = document.createElement('small');
    small.textContent = demo.detail;
    document.querySelector('#demo-label span').replaceChildren(document.createTextNode(demo.label), document.createElement('br'), small);
    buttons.forEach(button => {
      const selected = Number(button.dataset.demo) === index;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    manuallyPaused = false;
    video.load();
    tryPlay();
  }
  buttons.forEach(button => button.addEventListener('click', () => selectDemo(Number(button.dataset.demo))));
  if (video) {
    video.addEventListener('pause', () => {
      if (systemPause) { systemPause = false; return; }
      if (inView && !document.hidden && !video.ended) manuallyPaused = true;
    });
    video.addEventListener('play', () => { manuallyPaused = false; });
    if ('IntersectionObserver' in window) {
      const videoObserver = new IntersectionObserver(entries => {
        inView = entries[0].isIntersecting;
        if (inView) tryPlay();
        else pauseForSystem();
      }, { threshold: 0.15 });
      videoObserver.observe(video);
    } else { inView = true; tryPlay(); }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) pauseForSystem();
      else tryPlay();
    });
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) pauseForSystem();
      else tryPlay();
    });
  }
})();
