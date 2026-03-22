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

  // Close mobile nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ============================================
  // NAVBAR SCROLL TRANSPARENCY
  // ============================================
  const navbar = document.getElementById('navbar');

  const updateNavbar = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };

  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // ============================================
  // ACTIVE NAV HIGHLIGHTING
  // ============================================
  const sections = document.querySelectorAll('section[id]');
  const navItems = navLinks.querySelectorAll('a[href^="#"]');

  const activateNavLink = () => {
    const scrollY = window.scrollY + window.innerHeight / 3;

    let currentId = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navItems.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', activateNavLink, { passive: true });
  activateNavLink();

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
    // Fallback: show everything immediately
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ============================================
  // GALLERY LIGHTBOX
  // ============================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = document.querySelectorAll('.gallery-item');

  let currentIndex = 0;
  const galleryImages = [];

  // Collect gallery images (only items that have actual <img> elements)
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({ src: img.src, alt: img.alt, index });
    }
  });

  const openLightbox = (index) => {
    if (galleryImages.length === 0) return;
    currentIndex = index;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };

  const prevImage = () => {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
  };

  const nextImage = () => {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
  };

  // Attach click to gallery items that have images
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (!img) return;
      const imgIndex = galleryImages.findIndex(g => g.src === img.src);
      if (imgIndex !== -1) openLightbox(imgIndex);
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // ============================================
  // BOOKING FORM (Web3Forms)
  // ============================================
  const form = document.getElementById('bookingForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const accessKey = form.querySelector('input[name="access_key"]').value;
    if (accessKey === 'YOUR_ACCESS_KEY') {
      formStatus.textContent = 'Form not configured yet. Please add your Web3Forms access key.';
      formStatus.className = 'form-status error';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.className = 'form-status';
    formStatus.style.display = 'none';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Thanks! Your booking inquiry has been sent. We\'ll be in touch soon.';
        formStatus.className = 'form-status success';
        form.reset();
      } else {
        throw new Error(result.message || 'Something went wrong.');
      }
    } catch (err) {
      formStatus.textContent = err.message || 'Failed to send. Please try again or email us directly.';
      formStatus.className = 'form-status error';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Booking Inquiry';
    }
  });

  // ============================================
  // HIDE PAST SHOWS + ADD TO GOOGLE CALENDAR
  // ============================================
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  document.querySelectorAll('.show-card[data-date]').forEach(card => {
    try {
      const showDate = new Date(card.dataset.date + 'T23:59:59');
      if (showDate < today) {
        card.style.display = 'none';
        return;
      }

      const dateStr = card.dataset.date.replace(/-/g, '');
      const venue = card.querySelector('.show-details h3').textContent;
      const timeEl = card.querySelector('.show-time');
      if (!timeEl) return;
      const timeText = timeEl.textContent.trim();
      const title = 'Three and One @ ' + venue.split('\u2014')[0].trim();

      let dates;
      if (timeText === 'TBD') {
        const nextDay = new Date(card.dataset.date);
        nextDay.setDate(nextDay.getDate() + 1);
        const nd = nextDay.toISOString().slice(0, 10).replace(/-/g, '');
        dates = dateStr + '/' + nd;
      } else {
        const parts = timeText.split('\u2014').map(function(s) { return s.trim(); });
        const toMil = function(t) {
          var segs = t.split(' ');
          var hm = segs[0].split(':');
          var h = parseInt(hm[0], 10);
          var m = parseInt(hm[1], 10);
          if (segs[1] === 'PM' && h !== 12) h += 12;
          if (segs[1] === 'AM' && h === 12) h = 0;
          return (h < 10 ? '0' : '') + h + (m < 10 ? '0' : '') + m + '00';
        };
        dates = dateStr + 'T' + toMil(parts[0]) + '/' + dateStr + 'T' + toMil(parts[1]);
      }

      const calUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
        + '&text=' + encodeURIComponent(title)
        + '&dates=' + dates
        + '&location=' + encodeURIComponent(venue)
        + '&details=' + encodeURIComponent('Live music by Three and One!');

      const btn = document.createElement('a');
      btn.href = calUrl;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'add-to-cal';
      btn.textContent = '+ Add to Calendar';
      card.appendChild(btn);
    } catch (e) {
      // skip this card silently
    }
  });
})();
