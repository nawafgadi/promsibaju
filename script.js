/* ==========================================================================
   NAWAF APPAREL & JERSEY CATALOG - INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navLinks.classList.contains('open')) {
          icon.className = 'ri-close-line';
        } else {
          icon.className = 'ri-menu-line';
        }
      }
    });

    // Close menu when clicking nav item
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'ri-menu-line';
      });
    });
  }

  // 2. Header Scroll Effect
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 3. Product Front / Back Toggle
  const viewToggleButtons = document.querySelectorAll('.view-btn');
  viewToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentToggle = btn.closest('.product-view-toggle');
      const card = btn.closest('.product-card');
      if (!parentToggle || !card) return;

      parentToggle.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetView = btn.getAttribute('data-view');
      const frontImg = card.querySelector('.product-img-front');
      const backImg = card.querySelector('.product-img-back');

      if (targetView === 'back') {
        frontImg?.classList.add('hidden-view');
        backImg?.classList.remove('hidden-view');
      } else {
        backImg?.classList.add('hidden-view');
        frontImg?.classList.remove('hidden-view');
      }
    });
  });

  // 4. Gallery Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filter === 'all' || itemCategory === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 5. Image Lightbox Modal
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    if (!lightboxModal || !lightboxImg) return;
    lightboxImg.src = src;
    if (lightboxCaption) lightboxCaption.textContent = title || 'Preview Desain';
    lightboxModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Attach Lightbox to Gallery & Product images
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-title')?.textContent;
      if (img) openLightbox(img.src, title);
    });
  });

  document.querySelectorAll('.btn-zoom-product').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.product-card');
      const activeImg = card?.querySelector('.product-img:not(.hidden-view)');
      const title = card?.querySelector('.product-title')?.textContent;
      if (activeImg) openLightbox(activeImg.src, title);
    });
  });

  // 6. Interactive Custom Order Calculator & WhatsApp Generator
  const calcProduct = document.getElementById('calcProduct');
  const calcFabric = document.getElementById('calcFabric');
  const calcSleeve = document.getElementById('calcSleeve');
  const calcQty = document.getElementById('calcQty');
  const calcNotes = document.getElementById('calcNotes');

  const summaryProduct = document.getElementById('summaryProduct');
  const summaryFabric = document.getElementById('summaryFabric');
  const summaryQty = document.getElementById('summaryQty');
  const summaryUnitPrice = document.getElementById('summaryUnitPrice');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');
  const btnSendOrderWa = document.getElementById('btnSendOrderWa');

  function updateCalculator() {
    if (!calcProduct || !calcFabric || !calcQty) return;

    const basePrice = parseInt(calcProduct.value, 10) || 85000;
    const fabricExtra = parseInt(calcFabric.value, 10) || 0;
    const sleeveExtra = calcSleeve ? (parseInt(calcSleeve.value, 10) || 0) : 0;
    let qty = parseInt(calcQty.value, 10) || 1;
    if (qty < 1) qty = 1;

    let unitPrice = basePrice + fabricExtra + sleeveExtra;

    // Quantity Discount Rules
    let discountPercent = 0;
    if (qty >= 24) {
      discountPercent = 0.15; // 15% discount for 24+ pcs
    } else if (qty >= 12) {
      discountPercent = 0.10; // 10% discount for 12-23 pcs
    } else if (qty >= 6) {
      discountPercent = 0.05; // 5% discount for 6-11 pcs
    }

    const discountedUnitPrice = Math.round(unitPrice * (1 - discountPercent));
    const totalPrice = discountedUnitPrice * qty;

    const selectedProductName = calcProduct.options[calcProduct.selectedIndex].text.split('(')[0].trim();
    const selectedFabricName = calcFabric.options[calcFabric.selectedIndex].text.split('(')[0].trim();
    const selectedSleeveName = calcSleeve ? calcSleeve.options[calcSleeve.selectedIndex].text : 'Lengan Pendek';

    if (summaryProduct) summaryProduct.textContent = selectedProductName;
    if (summaryFabric) summaryFabric.textContent = `${selectedFabricName} (${selectedSleeveName})`;
    if (summaryQty) summaryQty.textContent = `${qty} pcs ${discountPercent > 0 ? `(Diskon ${(discountPercent*100)}%)` : ''}`;
    if (summaryUnitPrice) summaryUnitPrice.textContent = `Rp ${discountedUnitPrice.toLocaleString('id-ID')}`;
    if (summaryTotalPrice) summaryTotalPrice.textContent = `Rp ${totalPrice.toLocaleString('id-ID')}`;

    return {
      product: selectedProductName,
      fabric: selectedFabricName,
      sleeve: selectedSleeveName,
      qty,
      discountedUnitPrice,
      totalPrice,
      notes: calcNotes ? calcNotes.value.trim() : ''
    };
  }

  // Bind calculation events
  [calcProduct, calcFabric, calcSleeve, calcQty, calcNotes].forEach(el => {
    if (el) {
      el.addEventListener('input', updateCalculator);
      el.addEventListener('change', updateCalculator);
    }
  });

  // Initial Calculation Run
  updateCalculator();

  // Send Order via WhatsApp
  if (btnSendOrderWa) {
    btnSendOrderWa.addEventListener('click', (e) => {
      e.preventDefault();
      const data = updateCalculator();
      if (!data) return;

      const waNumber = '6288239386759'; // Primary WA
      const message = `Halo Nawaf Apparel, saya ingin konsultasi & pesan jersey dengan rincian berikut:\n\n` +
        `👕 *Jenis Produk:* ${data.product}\n` +
        `🧵 *Pilihan Bahan:* ${data.fabric}\n` +
        `✂️ *Model Lengan:* ${data.sleeve}\n` +
        `🔢 *Jumlah:* ${data.qty} pcs\n` +
        `💰 *Estimasi Harga/Pcs:* Rp ${data.discountedUnitPrice.toLocaleString('id-ID')}\n` +
        `💵 *Estimasi Total:* Rp ${data.totalPrice.toLocaleString('id-ID')}\n` +
        (data.notes ? `📝 *Catatan Desain/Nama Tim:* ${data.notes}\n\n` : `\n`) +
        `Mohon info ketersediaan slot produksi dan panduan pembuatan mockup desainnya. Terima kasih! 🙏`;

      const encodedMsg = encodeURIComponent(message);
      window.open(`https://wa.me/${waNumber}?text=${encodedMsg}`, '_blank');
      showToast('Membuka WhatsApp untuk mengirim rincian pesanan...');
    });
  }

  // Quick Order button in product cards
  document.querySelectorAll('.btn-order-quick').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const productName = btn.getAttribute('data-product-name') || 'Jersey Custom';
      const waNumber = '6288239386759';
      const message = `Halo Nawaf Apparel, saya tertarik memesan produk *${productName}*. Bisa tolong kirimkan info katalog lengkap, pilihan bahan, dan daftar ukuran (size chart)? Terima kasih!`;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
    });
  });

  // 7. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 8. Contact Form Submit to WA
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName')?.value.trim();
      const phone = document.getElementById('contactPhone')?.value.trim();
      const subject = document.getElementById('contactSubject')?.value.trim();
      const msg = document.getElementById('contactMsg')?.value.trim();

      if (!name || !phone || !msg) {
        showToast('Mohon lengkapi nama, nomor telepon, dan pesan Anda!');
        return;
      }

      const waNumber = '6288239386759';
      const fullText = `*Pesan Baru dari Website Katalog*\n\n` +
        `👤 *Nama:* ${name}\n` +
        `📞 *Kontak:* ${phone}\n` +
        `📌 *Keperluan:* ${subject || 'Tanya Jersey/Apparel'}\n\n` +
        `💬 *Pesan:* ${msg}`;

      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(fullText)}`, '_blank');
      showToast('Pesan berhasil dibuat! Mengalihkan ke WhatsApp...');
      contactForm.reset();
    });
  }

  // 9. Toast Notification Helper
  function showToast(text) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="ri-checkbox-circle-fill"></i> <span>${text}</span>`;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 4000);
  }
});
