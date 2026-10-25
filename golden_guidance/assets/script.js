document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  const hideLoader = () => { if (preloader) preloader.classList.add('hidden'); };
  window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 1800);

  const topBtn = document.getElementById('backTop');
  const updateTop = () => { if (topBtn) topBtn.classList.toggle('show', window.scrollY > 420); };
  window.addEventListener('scroll', updateTop, {passive:true});
  updateTop();
  if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  document.querySelectorAll('[data-current-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Opens the enquiry modal after a short delay once per browser session.
  // Change popupDelay in the HTML data attribute, or remove this block, to adjust behavior.
  const modalEl = document.getElementById('enquiryModal');
  if (modalEl && !sessionStorage.getItem('ggPopupSeen')) {
    const delay = Number(modalEl.dataset.popupDelay || 6500);
    setTimeout(() => {
      if (window.bootstrap && !sessionStorage.getItem('ggPopupSeen')) {
        bootstrap.Modal.getOrCreateInstance(modalEl).show();
        sessionStorage.setItem('ggPopupSeen', '1');
      }
    }, delay);
  }
  if (modalEl) modalEl.addEventListener('hidden.bs.modal', () => sessionStorage.setItem('ggPopupSeen','1'));

  // Send enquiry details to Golden Guidance on WhatsApp.
  document.querySelectorAll('.enquiry-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const isArabic = document.documentElement.lang === 'ar' || document.documentElement.dir === 'rtl';
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const service = (data.get('service') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      const text = isArabic
        ? `طلب جديد عبر الموقع - جولدن جايدانس\nالاسم: ${name}\nرقم الهاتف: ${phone}\nالبريد الإلكتروني: ${email || 'غير مذكور'}\nالخدمة المطلوبة: ${service}\nتفاصيل الطلب: ${message}`
        : `New Website Enquiry - Golden Guidance\nName: ${name}\nPhone: ${phone}\nEmail: ${email || 'Not provided'}\nService required: ${service}\nRequirements: ${message}`;
      const url = 'https://wa.me/971567061781?text=' + encodeURIComponent(text);
      const status = form.querySelector('.form-status');
      if (status) status.textContent = isArabic
        ? 'سيتم فتح واتساب برسالتك الجاهزة. اضغط إرسال داخل واتساب لإكمال الطلب.'
        : 'WhatsApp is opening with your enquiry prepared. Press Send in WhatsApp to complete your request.';
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
});
