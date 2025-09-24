(function(){
  'use strict';

  const SAMPLE_PRODUCTS = [
    {
      id: 'cathedral-peak-backpack',
      name: 'Cathedral Peak 14" Backpack',
      description: 'Rugged 14" laptop backpack with padded straps, a ventilated back panel, and on-trend heathered body fabric. Includes dual water bottle pockets and a trolley sleeve for effortless travel.',
      templateUrl: 'https://example.com/templates/cathedral-peak-backpack.pdf',
      preview3dUrl: 'https://example.com/3d/cathedral-peak-backpack',
      thumb: 'Assets/images/cathedral-peak-14-4421.jpg',
      gallery: [
        'Assets/images/cathedral-peak-14-4421.jpg',
        'Assets/images/4031_box.jpg',
        'Assets/images/Screenshot-2025-09-05-184646.jpg'
      ],
      variants: [
        { label: '25 units', price: 48.5 },
        { label: '50 units', price: 46.25 },
        { label: '100 units', price: 44 }
      ]
    },
    {
      id: 'greenville-crystal-award',
      name: 'Greenville Crystal Award',
      description: 'Optical crystal award with deep etch decoration. The beveled edges and satin-lined gift box deliver an elevated presentation for executive recognition.',
      templateUrl: null,
      preview3dUrl: 'https://example.com/3d/greenville-crystal-award',
      thumb: 'Assets/images/greenville-award-7-34-4031.jpg',
      gallery: [
        'Assets/images/greenville-award-7-34-4031.jpg',
        'Assets/images/4031_box.jpg'
      ],
      variants: [
        { label: 'Small (5" H)', price: 76 },
        { label: 'Medium (6" H)', price: 82 },
        { label: 'Large (7" H)', price: 88 }
      ]
    },
    {
      id: 'summit-heathered-fleece',
      name: 'Summit Heathered Fleece',
      description: 'Quarter-zip fleece with brushed interior, stand collar, and retail fit. Available in a full size run for team outfitting and employee programs.',
      templateUrl: 'https://example.com/templates/summit-heathered-fleece.ai',
      preview3dUrl: null,
      thumb: 'Assets/images/Screenshot-2025-09-05-184646.jpg',
      gallery: [
        'Assets/images/Screenshot-2025-09-05-184646.jpg',
        'Assets/images/cathedral-peak-14-4421.jpg'
      ],
      variants: [
        { label: 'Sizes XS-XL', price: 38 },
        { label: '2XL', price: 40.5 },
        { label: '3XL', price: 41.75 },
        { label: '4XL', price: null }
      ]
    }
  ];

  const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgODAwIDYwMCI+PHJlY3QgZmlsbD0iI2UyZThmMCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI2MDAiLz48ZyBmaWxsPSIjMzM0MTU1IiBmb250LWZhbWlseT0iSW50ZXIsICJTZWdvZSBVSSIsIHNhbnMtc2VyaWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjx0ZXh0IHg9IjQwMCIgeT0iMzEwIiBmb250LXNpemU9IjQ4Ij5ObyBJbWFnZTwvdGV4dD48L2c+PC9zdmc+';
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const state = {
    cardsEl: null,
    cardsGridEl: null,
    countEl: null,
    detailEl: null,
    titleEl: null,
    priceEl: null,
    descEl: null,
    variantsEl: null,
    heroEl: null,
    thumbsWrap: null,
    templateLink: null,
    previewLink: null,
    actionsWrap: null,
    overlayEl: null,
    closeBtn: null,
    lastFocused: null,
    lightbox: null
  };

  let scrollLockCount = 0;
  let storedOverflow = '';

  function toNumber(value){
    if(typeof value === 'number' && Number.isFinite(value)) return value;
    if(value == null) return null;
    const n = Number(String(value).replace(/[^0-9.\-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }

  function formatPrice(value){
    const num = toNumber(value);
    return num != null && num >= 0 ? currency.format(num) : 'Quote Upon Request';
  }

  function priceRangeText(variants){
    const prices = (variants || []).map(v => toNumber(v.price)).filter(v => v != null && v >= 0);
    if(!prices.length) return 'Quote Upon Request';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? currency.format(min) : `${currency.format(min)} – ${currency.format(max)}`;
  }

  function lockScroll(){
    if(scrollLockCount === 0){
      storedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    scrollLockCount++;
  }

  function unlockScroll(){
    if(scrollLockCount > 0){
      scrollLockCount--;
      if(scrollLockCount === 0){
        document.body.style.overflow = storedOverflow || '';
      }
    }
  }

  function injectStyles(){
    if(document.getElementById('showroom-inline-styles')) return;
    const style = document.createElement('style');
    style.id = 'showroom-inline-styles';
    style.textContent = `
      .detail .thumbs .thumb{cursor:zoom-in;}
      .detail .thumbs .thumb.active{outline:2px solid var(--brand);}
      .detail .hero img{cursor:zoom-in;}
      .detail .detail-buttons{display:flex;flex-wrap:wrap;gap:12px;margin-top:12px;}
      .detail .detail-buttons .preview-link{margin:0;}
      .lightbox{position:fixed;inset:0;background:rgba(15,23,42,.88);display:none;align-items:center;justify-content:center;padding:32px;z-index:2000;}
      .lightbox.open{display:flex;}
      .lightbox .lightbox-inner{position:relative;max-width:min(960px,92vw);max-height:92vh;width:100%;display:flex;align-items:center;justify-content:center;}
      .lightbox img{max-width:100%;max-height:92vh;width:auto;height:auto;border-radius:16px;box-shadow:0 20px 45px rgba(0,0,0,.5);object-fit:contain;background:#fff;}
      .lightbox .lightbox-close{position:absolute;top:-18px;right:-18px;width:44px;height:44px;border-radius:999px;border:none;background:rgba(15,23,42,.9);color:#fff;font-size:28px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;}
      .lightbox .lightbox-close:hover{background:rgba(15,23,42,.98);}
      .lightbox .lightbox-close:focus-visible{outline:2px solid #fff;}
      @media(max-width:600px){
        .lightbox{padding:20px;}
        .lightbox .lightbox-close{top:-12px;right:-12px;}
      }
    `;
    document.head.appendChild(style);
  }

  function ensureActionButtons(){
    if(!state.detailEl) return;
    const info = state.detailEl.querySelector('.info') || state.detailEl;
    const variantsAnchor = state.variantsEl || info.lastElementChild;
    let actions = info.querySelector('.detail-buttons');
    if(!actions){
      actions = document.createElement('div');
      actions.className = 'detail-buttons';
      actions.style.display = 'none';
      if(variantsAnchor){
        info.insertBefore(actions, variantsAnchor);
      } else {
        info.appendChild(actions);
      }
    }
    state.actionsWrap = actions;

    let templateLink = document.getElementById('detail-template');
    if(!templateLink){
      templateLink = document.createElement('a');
      templateLink.id = 'detail-template';
      templateLink.className = 'preview-link';
      templateLink.target = '_blank';
      templateLink.rel = 'noopener';
      actions.appendChild(templateLink);
    } else if(templateLink.parentElement !== actions){
      actions.insertBefore(templateLink, actions.firstChild);
    }
    templateLink.style.margin = '0';

    let previewLink = document.getElementById('detail-preview');
    if(!previewLink){
      previewLink = document.createElement('a');
      previewLink.id = 'detail-preview';
      previewLink.className = 'preview-link';
      previewLink.target = '_blank';
      previewLink.rel = 'noopener';
      actions.appendChild(previewLink);
    } else if(previewLink.parentElement !== actions){
      actions.appendChild(previewLink);
    }
    previewLink.style.margin = '0';

    state.templateLink = templateLink;
    state.previewLink = previewLink;
  }

  function ensureCardsGrid(){
    if(!state.cardsEl) return false;

    if(state.cardsEl.classList.contains('card-grid')){
      state.cardsGridEl = state.cardsEl;
      return true;
    }

    const existing = state.cardsEl.querySelector('.card-grid');
    if(existing){
      state.cardsGridEl = existing;
      return true;
    }

    state.cardsEl.classList.add('card-grid');
    state.cardsGridEl = state.cardsEl;
    return true;
  }

  function renderCards(products){
    if(!state.cardsGridEl) return;
    state.cardsGridEl.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('a');
      card.className = 'card';
      card.href = '#';
      card.setAttribute('role', 'button');
      card.dataset.productId = product.id;

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'card-thumb';
      const img = document.createElement('img');
      img.src = product.thumb || product.gallery?.[0] || PLACEHOLDER_IMAGE;
      img.alt = product.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.objectFit = 'contain';
      thumbWrap.appendChild(img);

      const meta = document.createElement('div');
      meta.className = 'card-meta';
      const title = document.createElement('div');
      title.className = 'card-title';
      title.textContent = product.name;
      const price = document.createElement('div');
      price.className = 'card-price';
      price.textContent = priceRangeText(product.variants);
      meta.appendChild(title);
      meta.appendChild(price);

      card.appendChild(thumbWrap);
      card.appendChild(meta);

      card.addEventListener('click', event => {
        event.preventDefault();
        openDrawer(product);
      });
      card.addEventListener('keydown', event => {
        if(event.key === ' ' || event.key === 'Enter' || event.key === 'Spacebar'){
          event.preventDefault();
          openDrawer(product);
        }
      });

      state.cardsGridEl.appendChild(card);
    });

    if(state.countEl){
      const count = products.length;
      state.countEl.textContent = `${count} product${count === 1 ? '' : 's'}`;
    }
  }

  function setDescription(text){
    if(!state.descEl) return;
    state.descEl.textContent = text ? String(text) : '';
    state.descEl.style.display = text ? 'block' : 'none';
  }

  function buildVariantsTable(variants){
    if(!state.variantsEl) return;
    state.variantsEl.innerHTML = '';
    if(!variants || !variants.length){
      state.variantsEl.style.display = 'none';
      return;
    }
    const table = document.createElement('table');
    table.className = 'variant-table';
    const thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Variant</th><th>Price</th></tr>';
    const tbody = document.createElement('tbody');
    variants.forEach(variant => {
      const tr = document.createElement('tr');
      const labelCell = document.createElement('td');
      labelCell.textContent = variant.label || variant.size || '';
      const priceCell = document.createElement('td');
      priceCell.textContent = formatPrice(variant.price);
      tr.appendChild(labelCell);
      tr.appendChild(priceCell);
      tbody.appendChild(tr);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    state.variantsEl.appendChild(table);
    state.variantsEl.style.display = 'block';
  }

  function updateActionButtons(product){
    if(!state.actionsWrap) return;
    let visible = 0;
    if(state.templateLink){
      if(product.templateUrl){
        state.templateLink.href = product.templateUrl;
        state.templateLink.textContent = 'Download Template';
        state.templateLink.style.display = 'inline-block';
        visible++;
      } else {
        state.templateLink.style.display = 'none';
      }
    }
    if(state.previewLink){
      if(product.preview3dUrl){
        state.previewLink.href = product.preview3dUrl;
        state.previewLink.textContent = '3D Preview';
        state.previewLink.style.display = 'inline-block';
        visible++;
      } else {
        state.previewLink.style.display = 'none';
      }
    }
    state.actionsWrap.style.display = visible ? 'flex' : 'none';
  }

  function updateGallery(product){
    if(!state.heroEl || !state.thumbsWrap) return;
    state.heroEl.innerHTML = '';
    state.thumbsWrap.innerHTML = '';
    const gallery = Array.isArray(product.gallery) && product.gallery.length
      ? product.gallery
      : (product.thumb ? [product.thumb] : []);
    if(!gallery.length){
      const img = document.createElement('img');
      img.src = PLACEHOLDER_IMAGE;
      img.alt = product.name;
      img.loading = 'lazy';
      img.decoding = 'async';
      img.style.objectFit = 'contain';
      state.heroEl.appendChild(img);
      return;
    }

    const heroImg = document.createElement('img');
    heroImg.decoding = 'async';
    heroImg.style.objectFit = 'contain';
    heroImg.style.cursor = 'zoom-in';
    heroImg.tabIndex = 0;
    heroImg.addEventListener('click', () => {
      state.lightbox.open(heroImg.src, heroImg.alt, heroImg);
    });
    heroImg.addEventListener('keydown', event => {
      if(event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar'){
        event.preventDefault();
        state.lightbox.open(heroImg.src, heroImg.alt, heroImg);
      }
    });
    state.heroEl.appendChild(heroImg);

    const setHero = (url, index) => {
      heroImg.src = url || PLACEHOLDER_IMAGE;
      heroImg.alt = `${product.name} image ${index + 1}`;
      Array.from(state.thumbsWrap.children).forEach((child, idx) => {
        child.classList.toggle('active', idx === index);
      });
    };

    gallery.forEach((url, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      thumb.tabIndex = 0;
      thumb.setAttribute('role', 'button');
      thumb.setAttribute('aria-label', `View larger image ${index + 1}`);
      thumb.style.cursor = 'zoom-in';
      const img = document.createElement('img');
      img.src = url;
      img.alt = `${product.name} thumbnail ${index + 1}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      thumb.appendChild(img);
      const open = () => {
        setHero(url, index);
        state.lightbox.open(url, `${product.name} image ${index + 1}`, thumb);
      };
      thumb.addEventListener('click', open);
      thumb.addEventListener('keydown', event => {
        if(event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar'){
          event.preventDefault();
          open();
        }
      });
      state.thumbsWrap.appendChild(thumb);
    });

    setHero(gallery[0], 0);
  }

  function openDrawer(product){
    if(!state.detailEl) return;
    state.lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    state.detailEl.classList.add('open');
    state.detailEl.setAttribute('aria-hidden', 'false');
    lockScroll();

    if(state.titleEl) state.titleEl.textContent = product.name;
    if(state.priceEl) state.priceEl.textContent = priceRangeText(product.variants);
    setDescription(product.description);
    buildVariantsTable(product.variants);
    updateActionButtons(product);
    updateGallery(product);

    (state.closeBtn || state.detailEl).focus({ preventScroll: true });
  }

  function closeDrawer(){
    if(!state.detailEl || !state.detailEl.classList.contains('open')) return;
    state.detailEl.classList.remove('open');
    state.detailEl.setAttribute('aria-hidden', 'true');
    unlockScroll();
    if(state.lastFocused && document.contains(state.lastFocused)){
      state.lastFocused.focus({ preventScroll: true });
    }
    state.lastFocused = null;
  }

  function createLightbox(){
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    const inner = document.createElement('div');
    inner.className = 'lightbox-inner';
    const img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    img.loading = 'lazy';
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close image preview');
    closeBtn.innerHTML = '&times;';
    inner.appendChild(img);
    inner.appendChild(closeBtn);
    overlay.appendChild(inner);
    document.body.appendChild(overlay);

    let openState = false;
    let origin = null;

    const open = (url, altText, originEl) => {
      origin = originEl instanceof HTMLElement ? originEl : null;
      img.src = url || PLACEHOLDER_IMAGE;
      img.alt = altText || '';
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
      lockScroll();
      closeBtn.focus({ preventScroll: true });
      openState = true;
    };

    const close = () => {
      if(!openState) return;
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      openState = false;
      unlockScroll();
      if(origin && document.contains(origin)){
        origin.focus({ preventScroll: true });
      }
      origin = null;
    };

    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', event => {
      if(event.target === overlay) close();
    });

    return {
      open,
      close,
      isOpen: () => openState
    };
  }

  function handleKeydown(event){
    if(event.key === 'Escape' || event.key === 'Esc'){
      if(state.lightbox && state.lightbox.isOpen()){
        state.lightbox.close();
      } else if(state.detailEl && state.detailEl.classList.contains('open')){
        closeDrawer();
      }
    }
  }

  function init(){
    state.cardsEl = document.getElementById('cards');
    state.countEl = document.getElementById('count');
    state.detailEl = document.getElementById('detail');
    if(!state.cardsEl || !state.detailEl){
      console.warn('Showroom markup is missing required containers.');
      return;
    }

    if(!ensureCardsGrid()){
      console.warn('Showroom cards container is missing a grid wrapper.');
      return;
    }

    state.titleEl = document.getElementById('detail-title');
    state.priceEl = document.getElementById('detail-price');
    state.descEl = document.getElementById('detail-desc');
    state.variantsEl = document.getElementById('detail-variants');
    state.heroEl = document.getElementById('detail-hero');
    state.thumbsWrap = state.detailEl.querySelector('.thumbs');
    state.overlayEl = state.detailEl.querySelector('.overlay');
    state.closeBtn = document.getElementById('detail-close') || state.detailEl.querySelector('.close');

    injectStyles();
    ensureActionButtons();
    state.lightbox = createLightbox();

    renderCards(SAMPLE_PRODUCTS);

    if(state.overlayEl) state.overlayEl.addEventListener('click', closeDrawer);
    if(state.closeBtn) state.closeBtn.addEventListener('click', closeDrawer);

    state.detailEl.setAttribute('role', 'dialog');
    state.detailEl.setAttribute('aria-modal', 'true');
    state.detailEl.setAttribute('aria-hidden', 'true');
  }

  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('DOMContentLoaded', init);
})();
