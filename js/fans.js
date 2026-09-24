(() => {
  'use strict';

  // ============================================
  // MOBILE NAVIGATION
  // ============================================
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ============================================
  // FAN MOSAIC
  // ============================================
  // Each entry is either a photo or the silent hover-to-play clip.
  // Dimensions are baked in so the masonry reserves the right space
  // before the media loads.
  const fanMedia = [
    { file: '20260725_074824.JPG', w: 1400, h: 693,
      alt: 'Three and One with a group of fans on stage under the tent at an outdoor show' },
    { file: 'IMG_7622.jpg', w: 1400, h: 1050,
      alt: 'The band with fans outside a beach bar at sunset' },
    { type: 'video', file: 'IMG_7755.mp4', poster: 'IMG_7755-poster.jpg', w: 540, h: 960,
      alt: 'A toddler on a parent’s shoulders reaching toward the stage while Three and One plays' },
    { file: 'IMG_7854.jpg', w: 1400, h: 1050,
      alt: 'A big group of fans crowded in with the band at dusk' },
    { file: 'IMG_7925.jpg', w: 1050, h: 1400,
      alt: 'Two fans outside a show, one of them wearing a Three and One t-shirt' },
    { file: 'IMG_7748.jpg', w: 1400, h: 1050,
      alt: 'The band pointing at a seated fan outside a bar' },
    { file: 'IMG_7858.jpg', w: 1400, h: 1050,
      alt: 'The band with fans on the sand outside a beach bar' },
    { file: 'IMG_7424.jpg', w: 1400, h: 952,
      alt: 'The band with a family of fans under the tent at a backyard show' },
    { file: 'IMG_4977.jpg', w: 1400, h: 1050,
      alt: 'The band with a Wawa employee on a post-show food run' }
  ];

  const BASE = 'images/FanPhotos/';
  const mosaic = document.getElementById('fanMosaic');
  const lightboxItems = [];

  // Touch devices get no hover, so the clip autoplays silently instead.
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  fanMedia.forEach(item => {
    const tile = document.createElement('div');
    tile.className = 'fan-tile';
    tile.dataset.index = lightboxItems.length;

    if (item.type === 'video') {
      tile.classList.add('fan-tile-video');

      const video = document.createElement('video');
      video.src = BASE + item.file;
      video.poster = BASE + item.poster;
      video.width = item.w;
      video.height = item.h;
      video.loop = true;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('muted', '');
      video.preload = canHover ? 'metadata' : 'auto';
      video.setAttribute('aria-label', item.alt);
      tile.appendChild(video);

      const badge = document.createElement('div');
      badge.className = 'fan-play-badge';
      badge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="6 4 20 12 6 20"/></svg>' +
        (canHover ? 'Hover to play' : 'Video');
      tile.appendChild(badge);

      if (canHover) {
        tile.addEventListener('mouseenter', () => {
          tile.classList.add('playing');
          // play() rejects if the browser blocks it; nothing to recover, so just ignore.
          const p = video.play();
          if (p) p.catch(() => tile.classList.remove('playing'));
        });
        tile.addEventListener('mouseleave', () => {
          tile.classList.remove('playing');
          video.pause();
          video.currentTime = 0;
        });
      } else {
        video.autoplay = true;
        video.setAttribute('autoplay', '');
        tile.classList.add('playing');
        const p = video.play();
        if (p) p.catch(() => tile.classList.remove('playing'));
      }

      lightboxItems.push({ type: 'video', src: BASE + item.file, alt: item.alt });
    } else {
      const src = BASE + item.file;
      const img = document.createElement('img');
      img.src = src;
      img.width = item.w;
      img.height = item.h;
      img.alt = item.alt;
      img.loading = 'lazy';
      img.decoding = 'async';
      tile.appendChild(img);

      lightboxItems.push({ type: 'image', src, alt: item.alt });
    }

    mosaic.appendChild(tile);
  });

  // ============================================
  // SCROLL ANIMATIONS (IntersectionObserver)
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // LIGHTBOX (handles both photos and the clip)
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const showItem = (index) => {
    currentIndex = index;
    const item = lightboxItems[currentIndex];

    if (item.type === 'video') {
      lightboxImg.style.display = 'none';
      lightboxImg.removeAttribute('src');
      lightboxVideo.style.display = '';
      lightboxVideo.src = item.src;
      lightboxVideo.setAttribute('aria-label', item.alt);
      const p = lightboxVideo.play();
      if (p) p.catch(() => {});
    } else {
      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.load();
      lightboxVideo.style.display = 'none';
      lightboxImg.style.display = '';
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt;
    }
  };

  const openLightbox = (index) => {
    if (lightboxItems.length === 0) return;
    showItem(index);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxVideo.pause();
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();
  };

  const prevItem = () => showItem((currentIndex - 1 + lightboxItems.length) % lightboxItems.length);
  const nextItem = () => showItem((currentIndex + 1) % lightboxItems.length);

  mosaic.addEventListener('click', (e) => {
    const tile = e.target.closest('.fan-tile');
    if (!tile) return;
    const idx = parseInt(tile.dataset.index, 10);
    if (!isNaN(idx)) openLightbox(idx);
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevItem);
  lightboxNext.addEventListener('click', nextItem);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevItem();
    if (e.key === 'ArrowRight') nextItem();
  });
})();
