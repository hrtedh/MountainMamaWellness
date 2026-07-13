document.addEventListener('DOMContentLoaded', () => {

  function applyLinks() {
    const podcastLinks = [document.getElementById('nav-podcast'), document.getElementById('nav-podcast-mobile')];
    const zoomLinks = [document.getElementById('nav-zoom'), document.getElementById('nav-zoom-mobile')];
    const fbLinks = [document.getElementById('social-facebook'), document.getElementById('social-facebook-mobile')];
    const igLinks = [document.getElementById('social-instagram'), document.getElementById('social-instagram-mobile')];

    podcastLinks.forEach(el => {
      if (el && SITE_LINKS.podcast) {
        el.addEventListener('click', () => window.open(SITE_LINKS.podcast, '_blank', 'noopener'));
      }
    });
    zoomLinks.forEach(el => {
      if (el && SITE_LINKS.zoom) {
        el.addEventListener('click', () => window.open(SITE_LINKS.zoom, '_blank', 'noopener'));
      }
    });

    const suppUrl = 'https://kristycirami.slim-n-trim.com/?fbclid=IwVERTSAS_eiVleHRuA2FlbQIxMABzcnRjBmFwcF9pZAwzNTA2ODU1MzE3MjgAAR6YjZ2Y6aA1PvFOKH5iZ6ZnV1-9SJLcRtkg6mYrHLdQGzssKt4FfrTHbD65tg_aem_y7vtKmMTgRbSoR24piX0PQ';
    [document.getElementById('nav-supplementation'), document.getElementById('nav-supplementation-mobile')].forEach(el => {
      if (el) el.addEventListener('click', () => window.open(suppUrl, '_blank', 'noopener'));
    });

    fbLinks.forEach(el => { if (el && SITE_LINKS.facebook) el.href = SITE_LINKS.facebook; });
  }

  if (typeof SITE_LINKS !== 'undefined') {
    applyLinks();
  } else {
    const script = document.createElement('script');
    script.src = 'config/links.js';
    script.onload = applyLinks;
    script.onerror = () => console.warn('links.js not found — update config/links.js with your URLs.');
    document.head.appendChild(script);
  }

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });
  }

  const navLinks = document.querySelectorAll('[data-section]');
  const sections = document.querySelectorAll('.page-section');

  function activateSection(sectionId) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(sectionId);
    if (target) target.classList.add('active');

    navLinks.forEach(l => {
      if (l.dataset.section === sectionId) l.classList.add('active');
    });

    if (mobileMenu) {
      mobileMenu.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const section = link.dataset.section;
      if (section) activateSection(section);
    });
  });

  const toggleBtns = document.querySelectorAll('.toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.toggle-group');
      group.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      btn.querySelector('input').checked = true;
    });
  });

  const otherCheckbox = document.getElementById('check-other');
  const otherInput = document.getElementById('other-symptom-input');
  if (otherCheckbox && otherInput) {
    otherCheckbox.addEventListener('change', () => {
      otherInput.classList.toggle('visible', otherCheckbox.checked);
    });
  }

  const form = document.getElementById('health-assessment-form');
  const successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('.submit-btn');
      const originalHTML = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite;width:20px;height:20px"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending...`;

      const formData = new FormData(form);

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          form.style.display = 'none';
          if (successMsg) successMsg.classList.add('visible');
        } else {
          btn.disabled = false;
          btn.innerHTML = originalHTML;
          alert('Something went wrong. Please try again or contact us directly.');
        }
      } catch {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
        alert('Connection error. Please check your internet and try again.');
      }
    });
  }
});
