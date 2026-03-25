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
  // GALLERY RIBBON + LIGHTBOX
  // ============================================
  const galleryPhotos = [
    '20191207_194402.jpg',
    '20191207_194446.jpg',
    '240622-LOWCLOUD-1053.jpg',
    '240622-LOWCLOUD-1055.jpg',
    '240622-LOWCLOUD-1056.jpg',
    '240622-LOWCLOUD-1057.jpg',
    '240622-LOWCLOUD-1067.jpg',
    '240622-LOWCLOUD-1075.jpg',
    '240622-LOWCLOUD-1081.jpg',
    '240622-LOWCLOUD-1084.jpg',
    '240622-LOWCLOUD-1085.jpg',
    '240622-LOWCLOUD-1091.jpg',
    '240622-lowcloud-1086.JPG',
    'DJI_0426.jpeg',
    'DJI_0442.JPEG',
    'IMG_3430.JPG',
    'IMG_4853.JPG',
    'IMG_5378.JPG',
    'IMG_5962.jpeg',
    'IMG_6409.JPG',
    'Image-14.JPEG',
    'DSF9854.JPG',
    'IMG_3069.jpg',
    'IMG_3399.jpg',
    'IMG_3454.jpg',
    'IMG_3534.jpg',
    'IMG_5447.jpg',
    'IMG_5494.jpg',
    'IMG_5625.jpg',
    'IMG_5892.jpg',
    'IMG_6824.jpg',
    'IMG_7436.jpg',
    'IMG_7452.jpg',
    'IMG_8355.jpg'
  ];

  // Shuffle photos (Fisher-Yates)
  for (let i = galleryPhotos.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [galleryPhotos[i], galleryPhotos[j]] = [galleryPhotos[j], galleryPhotos[i]];
  }

  const ribbonTrack = document.getElementById('galleryRibbonTrack');
  const galleryImages = [];

  // Build ribbon items — duplicate the set for seamless looping
  const buildItems = (photos) => {
    photos.forEach((file, i) => {
      const src = 'images/PhotoGallery/' + file;
      galleryImages.push({ src, alt: 'Three and One live photo' });
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.dataset.index = galleryImages.length - 1;
      const img = document.createElement('img');
      img.decoding = 'async';
      img.alt = 'Three and One live photo';
      img.dataset.retries = '0';
      img.onerror = function() {
        const retries = parseInt(this.dataset.retries, 10);
        if (retries < 3) {
          this.dataset.retries = retries + 1;
          const self = this;
          setTimeout(() => { self.src = src; }, 500 + Math.random() * 1000);
        }
      };
      img.src = src;
      div.appendChild(img);
      ribbonTrack.appendChild(div);
    });
  };

  buildItems(galleryPhotos);
  buildItems(galleryPhotos); // duplicate for seamless loop

  // JS-driven scroll using requestAnimationFrame
  let ribbonOffset = 0;
  let ribbonPaused = false;
  const ribbonSpeed = 0.5; // pixels per frame

  function getHalfWidth() {
    return ribbonTrack.scrollWidth / 2;
  }

  function scrollRibbon() {
    if (!ribbonPaused) {
      ribbonOffset -= ribbonSpeed;
      if (Math.abs(ribbonOffset) >= getHalfWidth()) {
        ribbonOffset = 0;
      }
      ribbonTrack.style.transform = 'translateX(' + ribbonOffset + 'px)';
    }
    requestAnimationFrame(scrollRibbon);
  }
  requestAnimationFrame(scrollRibbon);

  // Pause on hover
  ribbonTrack.addEventListener('mouseenter', () => { if (!lightbox.classList.contains('active')) ribbonPaused = true; });
  ribbonTrack.addEventListener('mouseleave', () => { if (!lightbox.classList.contains('active')) ribbonPaused = false; });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentIndex = 0;

  const openLightbox = (index) => {
    if (galleryImages.length === 0) return;
    currentIndex = index;
    lightboxImg.src = galleryImages[currentIndex].src;
    lightboxImg.alt = galleryImages[currentIndex].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    ribbonPaused = true;
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    ribbonPaused = false;
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

  ribbonTrack.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    const idx = parseInt(item.dataset.index, 10);
    if (!isNaN(idx)) openLightbox(idx);
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', prevImage);
  lightboxNext.addEventListener('click', nextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

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

  // ============================================
  // SHOWS VIEW TOGGLE (LIST / CALENDAR)
  // ============================================
  const showsList = document.querySelector('.shows-list');
  const calendarView = document.querySelector('.calendar-view');
  const viewBtns = document.querySelectorAll('.view-btn');
  const calDays = document.getElementById('calDays');
  const calMonthLabel = document.getElementById('calMonthLabel');
  const calDetails = document.getElementById('calDetails');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');

  // Collect all show data from cards
  const showData = [];
  document.querySelectorAll('.show-card[data-date]').forEach(card => {
    const venue = card.querySelector('.show-details h3').textContent;
    const time = card.querySelector('.show-time').textContent.trim();
    showData.push({ date: card.dataset.date, venue, time });
  });

  // Determine calendar month range from show data
  const showMonths = showData.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const minMonth = showMonths.reduce((a, b) => (a.year * 12 + a.month < b.year * 12 + b.month) ? a : b);
  const maxMonth = showMonths.reduce((a, b) => (a.year * 12 + a.month > b.year * 12 + b.month) ? a : b);

  let calYear = minMonth.year;
  let calMonth = minMonth.month;

  function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    calMonthLabel.textContent = monthNames[calMonth] + ' ' + calYear;

    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const todayStr = new Date().toISOString().slice(0, 10);

    calDays.innerHTML = '';
    calDetails.innerHTML = '';

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell';
      calDays.appendChild(cell);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = calYear + '-' + String(calMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
      const cell = document.createElement('div');
      cell.className = 'calendar-cell current-month';
      cell.textContent = day;

      if (dateStr === todayStr) {
        cell.classList.add('today');
      }

      const dayShows = showData.filter(s => s.date === dateStr);
      if (dayShows.length > 0) {
        cell.classList.add('has-show');
        cell.addEventListener('click', () => {
          calDetails.innerHTML = '';
          dayShows.forEach(show => {
            const card = document.createElement('div');
            card.className = 'show-card';
            card.innerHTML =
              '<div class="show-date"><div class="show-month">' + monthNames[calMonth].slice(0, 3) + '</div><div class="show-day">' + day + '</div></div>' +
              '<div class="show-divider"></div>' +
              '<div class="show-details"><h3>' + show.venue + '</h3><div class="show-time">' + show.time + '</div></div>';
            calDetails.appendChild(card);
          });
          // Scroll details into view
          calDetails.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      }

      calDays.appendChild(cell);
    }

    // Pad to 42 cells (6 rows) so the grid never changes size
    const totalCells = firstDay + daysInMonth;
    const remaining = 42 - totalCells;
    for (let i = 0; i < remaining; i++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-cell';
      calDays.appendChild(cell);
    }

    // Enable/disable nav buttons
    calPrev.disabled = (calYear === minMonth.year && calMonth === minMonth.month);
    calNext.disabled = (calYear === maxMonth.year && calMonth === maxMonth.month);
    calPrev.style.opacity = calPrev.disabled ? '0.3' : '1';
    calNext.style.opacity = calNext.disabled ? '0.3' : '1';
  }

  calPrev.addEventListener('click', () => {
    if (calMonth === 0) { calMonth = 11; calYear--; }
    else { calMonth--; }
    renderCalendar();
  });

  calNext.addEventListener('click', () => {
    if (calMonth === 11) { calMonth = 0; calYear++; }
    else { calMonth++; }
    renderCalendar();
  });

  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      viewBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (btn.dataset.view === 'list') {
        showsList.style.display = '';
        calendarView.style.display = 'none';
      } else {
        showsList.style.display = 'none';
        calendarView.style.display = '';
        renderCalendar();
      }
    });
  });

  // ============================================
  // HIDE PAST SHOWS + ADD TO GOOGLE CALENDAR
  // ============================================
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
