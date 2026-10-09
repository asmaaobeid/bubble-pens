import { WHATSAPP_NUMBER, BRAND, PRODUCT } from './config.js'

const money = (n) => `$${Number(n).toFixed(2)}`

/** Real product photos (same Bubble Popcorn Drawing Pens product as Alibaba listing) */
const GALLERY = [
  { type: 'image', src: '/media/gallery-01.jpg', alt: 'Product pack front' },
  { type: 'image', src: '/media/gallery-02.jpg', alt: 'Pens close-up' },
  { type: 'image', src: '/media/gallery-03.jpg', alt: 'Color set detail' },
  { type: 'image', src: '/media/gallery-04.jpg', alt: 'Box and pens' },
  { type: 'image', src: '/media/gallery-05.jpg', alt: 'Puffy art result' },
  { type: 'image', src: '/media/gallery-06.jpg', alt: 'Craft example' },
  { type: 'image', src: '/media/gallery-07.jpg', alt: 'Kids craft use' },
  { type: 'image', src: '/media/gallery-08.jpg', alt: '3D popcorn texture' },
  { type: 'image', src: '/media/gallery-13.jpg', alt: 'Six neon pens' },
  { type: 'image', src: '/media/gallery-15.jpg', alt: 'Before and after puff' },
  { type: 'image', src: '/media/gallery-18.jpg', alt: 'Greeting card project' },
  { type: 'image', src: '/media/gallery-21.jpg', alt: 'Retail product photo' },
  { type: 'image', src: '/media/gallery-23.jpg', alt: 'Heat puff demonstration' },
  { type: 'image', src: '/media/gallery-24.jpg', alt: 'Finished popcorn art' },
  { type: 'image', src: '/media/gallery-25.jpg', alt: 'Color variety shot' },
  {
    type: 'video',
    src: '/media/demo.mp4',
    thumb: '/media/gallery-05.jpg',
    alt: 'Local demo reel',
    label: '▶ DEMO',
  },
  {
    type: 'youtube',
    src: 'https://www.youtube.com/embed/VEbGwYbeCQc?rel=0&autoplay=1',
    watch: 'https://www.youtube.com/shorts/VEbGwYbeCQc',
    thumb: '/media/gallery-05.jpg',
    alt: 'YouTube Short demo',
    label: '▶ YT',
  },
]

const state = {
  pack: 1,
  price: PRODUCT.price,
  compare: PRODUCT.compareAt,
  qty: 1,
  favorites: new Set(),
  cart: loadCart(),
  galleryIndex: 0,
}

const els = {
  colorPicks: document.getElementById('color-picks'),
  packOptions: document.getElementById('pack-options'),
  priceNow: document.getElementById('price-now'),
  priceWas: document.getElementById('price-was'),
  qty: document.getElementById('qty'),
  qtyMinus: document.getElementById('qty-minus'),
  qtyPlus: document.getElementById('qty-plus'),
  addToCart: document.getElementById('add-to-cart'),
  buyWhatsapp: document.getElementById('buy-whatsapp'),
  cartToggle: document.getElementById('cart-toggle'),
  cartClose: document.getElementById('cart-close'),
  cartOverlay: document.getElementById('cart-overlay'),
  cartDrawer: document.getElementById('cart-drawer'),
  cartItems: document.getElementById('cart-items'),
  cartEmpty: document.getElementById('cart-empty'),
  cartFoot: document.getElementById('cart-foot'),
  cartCount: document.getElementById('cart-count'),
  cartTotal: document.getElementById('cart-total'),
  checkoutWa: document.getElementById('checkout-wa'),
  customerName: document.getElementById('customer-name'),
  customerNote: document.getElementById('customer-note'),
  cartShop: document.getElementById('cart-shop'),
  toast: document.getElementById('toast'),
  galleryImage: document.getElementById('gallery-image'),
  galleryVideo: document.getElementById('gallery-video'),
  demoPlayer: document.getElementById('demo-player'),
  ytPlayer: document.getElementById('yt-player'),
  ytFallback: document.getElementById('yt-fallback'),
  galleryThumbs: document.getElementById('gallery-thumbs'),
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem('puffpop-cart') || '[]')
  } catch {
    return []
  }
}

function saveCart() {
  localStorage.setItem('puffpop-cart', JSON.stringify(state.cart))
}

function renderColors() {
  els.colorPicks.innerHTML = PRODUCT.colors
    .map(
      (c) => `
      <button
        type="button"
        class="swatch${state.favorites.has(c.id) ? ' is-active' : ''}"
        style="background:${c.hex}"
        data-color="${c.id}"
        title="${c.name}"
        aria-label="${c.name}"
        aria-pressed="${state.favorites.has(c.id)}"
      ></button>`
    )
    .join('')
}

function updatePriceUI() {
  els.priceNow.textContent = money(state.price)
  els.priceWas.textContent = money(state.compare)
}

function selectedColorNames() {
  return PRODUCT.colors
    .filter((c) => state.favorites.has(c.id))
    .map((c) => c.name)
}

function currentLine() {
  const colors = selectedColorNames()
  return {
    id: `${PRODUCT.id}-pack${state.pack}-${[...state.favorites].sort().join('-') || 'all'}`,
    name: PRODUCT.name,
    pack: state.pack,
    packLabel: `${state.pack} set${state.pack > 1 ? 's' : ''} (${state.pack * PRODUCT.packSize} pens)`,
    unitPrice: state.price,
    qty: state.qty,
    colors,
    colorsLabel: colors.length ? colors.join(', ') : 'Full 6-color set',
  }
}

function lineTotal(item) {
  return item.unitPrice * item.qty
}

function cartCount() {
  return state.cart.reduce((sum, i) => sum + i.qty, 0)
}

function cartSum() {
  return state.cart.reduce((sum, i) => sum + lineTotal(i), 0)
}

function renderCart() {
  els.cartCount.textContent = String(cartCount())
  const empty = state.cart.length === 0
  els.cartEmpty.hidden = !empty
  els.cartFoot.hidden = empty
  els.cartItems.hidden = empty

  els.cartItems.innerHTML = state.cart
    .map(
      (item, index) => `
      <article class="cart-item">
        <h3>${item.name}</h3>
        <span class="item-price">${money(lineTotal(item))}</span>
        <p>${item.packLabel} · Qty ${item.qty}<br>Colors: ${item.colorsLabel}</p>
        <button type="button" class="remove" data-remove="${index}">Remove</button>
      </article>`
    )
    .join('')

  els.cartTotal.textContent = money(cartSum())
}

function openCart() {
  els.cartDrawer.classList.add('is-open')
  els.cartDrawer.setAttribute('aria-hidden', 'false')
  els.cartOverlay.hidden = false
  document.body.style.overflow = 'hidden'
}

function closeCart() {
  els.cartDrawer.classList.remove('is-open')
  els.cartDrawer.setAttribute('aria-hidden', 'true')
  els.cartOverlay.hidden = true
  document.body.style.overflow = ''
}

function showToast(message) {
  els.toast.hidden = false
  els.toast.textContent = message
  els.toast.classList.add('is-show')
  clearTimeout(showToast._t)
  showToast._t = setTimeout(() => {
    els.toast.classList.remove('is-show')
  }, 2200)
}

function addCurrentToCart() {
  const line = currentLine()
  const existing = state.cart.find((i) => i.id === line.id)
  if (existing) {
    existing.qty += line.qty
  } else {
    state.cart.push(line)
  }
  saveCart()
  renderCart()
  showToast('Added to cart')
  openCart()
}

function buildWhatsAppMessage({ items, name, note, mode }) {
  const lines = [
    `Hi ${BRAND}! I'd like to ${mode === 'buy' ? 'order this now' : 'checkout my cart'}:`,
    '',
    ...items.map(
      (item, i) =>
        `${i + 1}) ${item.name}\n` +
        `   Pack: ${item.packLabel}\n` +
        `   Qty: ${item.qty}\n` +
        `   Colors: ${item.colorsLabel}\n` +
        `   Line: ${money(lineTotal(item))}`
    ),
    '',
    `Total: ${money(items.reduce((s, i) => s + lineTotal(i), 0))}`,
  ]

  if (name) {
    lines.push(`Name: ${name}`)
  }
  if (note) {
    lines.push(`Note: ${note}`)
  }

  lines.push('', 'Please confirm availability & delivery. Thanks!')
  return lines.join('\n')
}

function openWhatsApp(message) {
  const text = encodeURIComponent(message)
  const phone = String(WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

/* Events */
els.colorPicks.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-color]')
  if (!btn) return
  const id = btn.dataset.color
  if (state.favorites.has(id)) state.favorites.delete(id)
  else state.favorites.add(id)
  renderColors()
})

els.packOptions.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-pack]')
  if (!btn) return
  state.pack = Number(btn.dataset.pack)
  state.price = Number(btn.dataset.price)
  state.compare = Number(btn.dataset.compare)
  els.packOptions.querySelectorAll('.pack').forEach((el) => el.classList.toggle('is-active', el === btn))
  updatePriceUI()
})

els.qtyMinus.addEventListener('click', () => {
  state.qty = Math.max(1, state.qty - 1)
  els.qty.value = state.qty
})

els.qtyPlus.addEventListener('click', () => {
  state.qty = Math.min(20, state.qty + 1)
  els.qty.value = state.qty
})

els.qty.addEventListener('change', () => {
  state.qty = Math.min(20, Math.max(1, Number(els.qty.value) || 1))
  els.qty.value = state.qty
})

els.addToCart.addEventListener('click', addCurrentToCart)

els.buyWhatsapp.addEventListener('click', () => {
  const item = currentLine()
  const message = buildWhatsAppMessage({
    items: [item],
    name: '',
    note: '',
    mode: 'buy',
  })
  openWhatsApp(message)
})

els.cartToggle.addEventListener('click', openCart)
els.cartClose.addEventListener('click', closeCart)
els.cartOverlay.addEventListener('click', closeCart)
els.cartShop.addEventListener('click', closeCart)

els.cartItems.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-remove]')
  if (!btn) return
  state.cart.splice(Number(btn.dataset.remove), 1)
  saveCart()
  renderCart()
})

els.checkoutWa.addEventListener('click', () => {
  if (!state.cart.length) return
  const message = buildWhatsAppMessage({
    items: state.cart,
    name: els.customerName.value.trim(),
    note: els.customerNote.value.trim(),
    mode: 'cart',
  })
  openWhatsApp(message)
})

function showGalleryItem(index) {
  state.galleryIndex = index
  const item = GALLERY[index]
  if (!item) return

  els.galleryThumbs.querySelectorAll('.thumb').forEach((btn, i) => {
    btn.classList.toggle('is-active', i === index)
  })

  const stopLocal = () => {
    if (els.demoPlayer) {
      els.demoPlayer.pause()
      els.demoPlayer.hidden = true
    }
  }
  const stopYt = () => {
    if (els.ytPlayer) {
      els.ytPlayer.src = ''
      els.ytPlayer.hidden = true
    }
    if (els.ytFallback) els.ytFallback.hidden = true
  }

  if (item.type === 'video') {
    els.galleryImage.hidden = true
    els.galleryVideo.hidden = false
    stopYt()
    if (els.demoPlayer) {
      els.demoPlayer.hidden = false
      els.demoPlayer.src = item.src
      els.demoPlayer.play().catch(() => {})
    }
    return
  }

  if (item.type === 'youtube') {
    els.galleryImage.hidden = true
    els.galleryVideo.hidden = false
    stopLocal()
    if (els.ytPlayer) {
      els.ytPlayer.hidden = false
      els.ytPlayer.src = item.src
    }
    if (els.ytFallback) {
      els.ytFallback.hidden = false
      els.ytFallback.href = item.watch || item.src
    }
    return
  }

  els.galleryVideo.hidden = true
  stopLocal()
  stopYt()
  els.galleryImage.hidden = false
  els.galleryImage.src = item.src
  els.galleryImage.alt = item.alt
}

function renderGallery() {
  els.galleryThumbs.innerHTML = GALLERY.map((item, index) => {
    if (item.type === 'video' || item.type === 'youtube') {
      const label = item.label || '▶ VIDEO'
      return `<button type="button" class="thumb is-video${index === 0 ? ' is-active' : ''}" data-index="${index}" aria-label="${item.alt}">${label}</button>`
    }
    return `<button type="button" class="thumb${index === 0 ? ' is-active' : ''}" data-index="${index}" aria-label="${item.alt}">
      <img src="${item.src}" alt="" loading="lazy" />
    </button>`
  }).join('')

  els.galleryThumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-index]')
    if (!btn) return
    showGalleryItem(Number(btn.dataset.index))
  })

  showGalleryItem(0)
}

renderGallery()
renderColors()
updatePriceUI()
renderCart()
