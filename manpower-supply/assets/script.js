(() => {
  const ready = (fn) => document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn();
  ready(() => {
    const preloader = document.getElementById('preloader');
    const hideLoader = () => preloader?.classList.add('hide');
    window.addEventListener('load', hideLoader, { once: true });
    setTimeout(hideLoader, 1800);

    document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());
    const current = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('[data-nav]').forEach(a => {
      if (a.dataset.nav === current || (current === '' && a.dataset.nav === 'index.html')) a.classList.add('active');
    });

    const backTop = document.getElementById('backTop');
    const updateTop = () => backTop?.classList.toggle('show', window.scrollY > 450);
    window.addEventListener('scroll', updateTop, { passive: true }); updateTop();
    backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      }), { threshold: .12 });
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));

    // Enquiry form: open a prefilled WhatsApp message for the visitor to review and send.
    document.querySelectorAll('.enquiry-form').forEach(form => form.addEventListener('submit', event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const message = [
        'Hello Golden Guidance, I would like to make an enquiry.',
        `Name: ${data.get('name') || ''}`,
        `Phone: ${data.get('phone') || ''}`,
        `Email: ${data.get('email') || 'Not provided'}`,
        `Service: ${data.get('service') || 'General enquiry'}`,
        `Requirements: ${data.get('message') || ''}`
      ].join('\n');
      const url = `https://wa.me/971567061781?text=${encodeURIComponent(message)}`;
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Opening WhatsApp… please review and send your message.';
      window.open(url, '_blank', 'noopener,noreferrer');
    }));

    // Auto-open the enquiry popup once per browser tab after a short delay.
    const modalEl = document.getElementById('enquiryModal');
    if (modalEl && !sessionStorage.getItem('ggEnquiryShown')) {
      const delay = Number(modalEl.dataset.popupDelay || 8000);
      setTimeout(() => {
        if (!document.hidden && window.bootstrap?.Modal) {
          bootstrap.Modal.getOrCreateInstance(modalEl).show();
          sessionStorage.setItem('ggEnquiryShown', '1');
        }
      }, delay);
    }
  });
})();
