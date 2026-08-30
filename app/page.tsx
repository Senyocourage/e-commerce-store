'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowRight, Check, LockKeyhole, Minus, Plus, ShieldCheck, Sparkles, Zap } from 'lucide-react'
import { formatPrice, PRODUCTS } from '@/lib/products'

const product = PRODUCTS[0]

function Storefront() {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const status = searchParams.get('checkout')

  async function beginCheckout() {
    setLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, quantity }),
      })
      const data = await response.json()
      if (data.url) window.location.assign(data.url)
    } finally { setLoading(false) }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Aether home"><span className="brand-mark"><Sparkles size={15} /></span><span>AETHER<span className="brand-dot">.</span></span></a>
        <div className="topbar-meta"><span className="status-dot" /><span>Now shipping worldwide</span><button className="bag-button" aria-label="Shopping bag">Bag <span>{quantity}</span></button></div>
      </header>
      <div className="content-grid" id="top">
        <section className="hero-panel" aria-labelledby="hero-title">
          <div className="eyebrow"><span className="eyebrow-line" /> New dimension of work</div>
          <h1 id="hero-title">Welcome<br /><span>to My Store</span></h1>
          <p className="hero-copy">Aether One is a spatial computer for the curious. Move through your ideas, naturally.</p>
          <div className="hero-actions"><a className="primary-button" href="#checkout">Get Aether One <ArrowRight size={17} /></a><a className="text-button" href="#details">Explore the specs <span>↗</span></a></div>
          <div className="hero-footnote"><ShieldCheck size={15} /> 30-day returns <i /> <LockKeyhole size={14} /> Secure checkout</div>
        </section>
        <section className="product-panel" id="details" aria-labelledby="product-title">
          <div className="product-stage" aria-label="Aether One spatial computer product image"><div className="device-shadow" /><div className="device"><div className="device-bridge" /><div className="device-glass"><div className="glass-reflection" /></div><div className="device-arm left-arm" /><div className="device-arm right-arm" /><div className="device-tip left-tip" /><div className="device-tip right-tip" /></div><div className="stage-label label-top">AETHER / 01</div><div className="stage-label label-bottom">SPATIAL COMPUTING</div></div>
          <div className="product-info"><div><p className="product-kicker">{product.edition}</p><h2 id="product-title">{product.name}</h2></div><p className="product-price">{formatPrice(product.priceInCents)}<span> USD</span></p></div>
          <p className="product-description">{product.description}</p><div className="feature-row"><div><Zap size={17} /><span>All-day battery</span></div><div><Sparkles size={17} /><span>Infinite canvas</span></div><div><ShieldCheck size={17} /><span>Private by design</span></div></div>
        </section>
        <section className="checkout-panel" id="checkout" aria-labelledby="checkout-title">
          <div className="checkout-heading"><div><p className="product-kicker">Ready when you are</p><h2 id="checkout-title">Checkout</h2></div><div className="secure-chip"><LockKeyhole size={13} /> SSL SECURE</div></div>
          {status === 'success' && <div className="notice success"><Check size={15} /> Payment complete. Your Aether is on the way.</div>}
          {status === 'cancelled' && <div className="notice">Checkout cancelled. Your bag is still saved.</div>}
          <div className="order-summary"><div className="mini-product"><span className="mini-device" /><div><strong>{product.name}</strong><span>{product.edition}</span></div></div><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(Math.min(5, quantity + 1))} aria-label="Increase quantity"><Plus size={14} /></button></div></div>
          <div className="form-grid"><label>Email address<input type="email" placeholder="you@company.com" autoComplete="email" /></label><label>Shipping country<select defaultValue="US"><option value="US">United States</option><option value="CA">Canada</option><option value="GB">United Kingdom</option></select></label></div>
          <div className="total-row"><span>Total today</span><strong>{formatPrice(product.priceInCents * quantity)} <small>USD</small></strong></div>
          <button className="pay-button" onClick={beginCheckout} disabled={loading}>{loading ? 'Opening secure checkout…' : <>Continue to payment <ArrowRight size={17} /></>}</button>
          <p className="terms">Secure payment powered by Stripe. By continuing, you agree to Aether&apos;s <u>Terms</u> and <u>Privacy Policy</u>.</p>
        </section>
      </div>
      <footer><span>© 2026 Aether Labs</span><span>Designed for the next idea</span><span>Made with intention <i className="footer-dot" /></span></footer>
    </main>
  )
}

export default function Page() {
  return <Suspense fallback={<main className="app-shell" aria-busy="true" />}><Storefront /></Suspense>
}
