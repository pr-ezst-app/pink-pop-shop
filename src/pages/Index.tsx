import { useState } from "react";
import Icon from "@/components/ui/icon";

const PRODUCT_COLORS: Record<string, string[]> = {
  bracelets: ["#f9a8d4", "#f472b6"],
  anklets: ["#fbcfe8", "#ec4899"],
  necklaces: ["#fce7f3", "#db2777"],
};

type Page = "home" | "shop" | "about" | "cart";
type Category = "all" | "bracelets" | "anklets" | "necklaces";

interface Product {
  id: number;
  name: string;
  emoji: string;
  price: number;
  category: Category;
  description: string;
  image: string;
  badge?: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: "Rubber Bracelet", emoji: "💗", price: 2.99, category: "bracelets", description: "Soft stretchy rubber band bracelet — stackable & super comfy!", image: "", badge: "Best Seller" },
  { id: 2, name: "Straw Bracelet", emoji: "🌿", price: 3.99, category: "bracelets", description: "Cute handwoven straw bracelet with a boho-girly vibe.", image: "" },
  { id: 3, name: "Rubber Anklet", emoji: "🌸", price: 2.99, category: "anklets", description: "Stretchy rubber anklet that fits all sizes — fun & playful!", image: "", badge: "New" },
  { id: 4, name: "Straw Anklet", emoji: "🐚", price: 3.99, category: "anklets", description: "Braided straw anklet perfect for summer days & beach vibes.", image: "" },
  { id: 5, name: "Rubber Necklace", emoji: "🍒", price: 3.99, category: "necklaces", description: "Chunky rubber band necklace in the cutest pastel colors!", image: "", badge: "Fan Fave" },
  { id: 6, name: "Straw Necklace", emoji: "✨", price: 4.99, category: "necklaces", description: "Woven straw necklace with a natural, aesthetic finish.", image: "" },
];

const CATEGORIES = [
  { key: "all" as Category, label: "All ✨" },
  { key: "bracelets" as Category, label: "Bracelets 💗" },
  { key: "anklets" as Category, label: "Anklets 🌸" },
  { key: "necklaces" as Category, label: "Necklaces 🍒" },
];

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [category, setCategory] = useState<Category>("all");
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<number | null>(null);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1000);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0)
    );
  };

  const filteredProducts = category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

  return (
    <div className="min-h-screen font-nunito" style={{ background: "linear-gradient(135deg, #fff0f5 0%, #fce4ec 40%, #ffeef6 100%)" }}>

      {/* NAV */}
      <nav className="pink-glass sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setPage("home")} className="font-pacifico text-2xl" style={{ color: "#e91e8c", textShadow: "0 2px 8px rgba(233,30,140,0.2)" }}>
            Pink Pop Shop 💗
          </button>
          <div className="hidden md:flex items-center gap-6">
            {[
              { key: "home", label: "Home" },
              { key: "shop", label: "Shop" },
              { key: "about", label: "About" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setPage(key as Page)}
                className="font-nunito text-sm font-semibold transition-all hover:opacity-70"
                style={{ color: page === key ? "#e91e8c" : "#c06090", fontWeight: page === key ? 800 : 600 }}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative btn-pink px-4 py-2 flex items-center gap-2 text-sm"
          >
            <Icon name="ShoppingBag" size={16} />
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-sparkle" style={{ color: "#e91e8c", border: "2px solid #e91e8c" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
        <div className="md:hidden flex gap-4 px-4 pb-3">
          {["home", "shop", "about"].map(k => (
            <button key={k} onClick={() => setPage(k as Page)} className="text-sm font-semibold capitalize" style={{ color: page === k ? "#e91e8c" : "#c06090" }}>
              {k}
            </button>
          ))}
        </div>
      </nav>

      {/* CART DRAWER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setCartOpen(false)} />
          <div className="relative animate-slide-in-right w-full max-w-sm h-full flex flex-col shadow-2xl" style={{ background: "#fff0f5" }}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "#f8bbd9" }}>
              <h2 className="font-pacifico text-xl" style={{ color: "#e91e8c" }}>Your Cart 🛍️</h2>
              <button onClick={() => setCartOpen(false)} className="btn-outline-pink p-2 rounded-full">
                <Icon name="X" size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 opacity-60">
                  <div className="text-4xl mb-3">🛒</div>
                  <p className="font-semibold" style={{ color: "#c06090" }}>Your cart is empty!</p>
                  <button onClick={() => { setCartOpen(false); setPage("shop"); }} className="btn-pink px-6 py-2 mt-4 inline-block">Shop Now ✨</button>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="product-card rounded-2xl p-3 flex gap-3">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: `linear-gradient(135deg, ${(PRODUCT_COLORS[item.category] || ["#f9a8d4","#f472b6"])[0]}, ${(PRODUCT_COLORS[item.category] || ["#f9a8d4","#f472b6"])[1]})` }}>{item.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: "#4a1030" }}>{item.emoji} {item.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#c06090" }}>${item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#f06292" }}>-</button>
                      <span className="font-bold text-sm" style={{ color: "#4a1030" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#f06292" }}>+</button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-auto opacity-40 hover:opacity-100 transition-opacity">
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-5 border-t space-y-3" style={{ borderColor: "#f8bbd9" }}>
                <div className="flex justify-between font-bold text-lg" style={{ color: "#4a1030" }}>
                  <span>Total:</span>
                  <span style={{ color: "#e91e8c" }}>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => { setPage("cart"); setCartOpen(false); }}
                  className="btn-pink w-full py-3 text-center font-bold text-base"
                >
                  Checkout 💗
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== HOME PAGE ===== */}
      {page === "home" && (
        <div>
          <section className="relative overflow-hidden py-16 md:py-28 px-4 text-center">
            <div className="absolute top-8 left-8 text-4xl animate-float opacity-60">🌸</div>
            <div className="absolute top-16 right-12 text-3xl animate-float delay-200 opacity-60">⭐</div>
            <div className="absolute bottom-8 left-16 text-3xl animate-float delay-400 opacity-50">💕</div>
            <div className="absolute bottom-12 right-8 text-4xl animate-float delay-300 opacity-50">✨</div>
            <div className="absolute top-24 left-1/4 text-2xl animate-sparkle opacity-40">🌟</div>
            <div className="absolute top-12 right-1/3 text-2xl animate-sparkle delay-300 opacity-40">💖</div>

            <div className="relative max-w-3xl mx-auto animate-fade-in-up">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold mb-6 uppercase tracking-widest" style={{ background: "#fce4ec", color: "#e91e8c", border: "1.5px solid #f8bbd9" }}>
                ✨ New Collection Just Dropped
              </div>
              <h1 className="font-pacifico text-4xl md:text-6xl leading-tight mb-6" style={{ color: "#e91e8c", textShadow: "0 4px 20px rgba(233,30,140,0.2)" }}>
                Cute accessories<br />
                <span style={{ color: "#f06292" }}>for your everyday glow</span>
              </h1>
              <p className="text-lg md:text-xl font-semibold mb-8 max-w-xl mx-auto" style={{ color: "#a0507a" }}>
                Dreamy bracelets, anklets, necklaces & reusable straws that make every outfit pop 💗
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={() => setPage("shop")} className="btn-pink px-8 py-4 text-base font-bold">
                  Shop Now ✨
                </button>
                <button onClick={() => setPage("about")} className="btn-outline-pink px-8 py-4 text-base">
                  Our Story 💕
                </button>
              </div>
            </div>
          </section>

          <section className="py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap gap-3 justify-center mb-10">
                {[
                  { label: "Bracelets 💗", cat: "bracelets" },
                  { label: "Anklets 🌸", cat: "anklets" },
                  { label: "Necklaces 🍒", cat: "necklaces" },
                ].map(({ label, cat }) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat as Category); setPage("shop"); }}
                    className="btn-outline-pink px-5 py-2.5 text-sm font-bold"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <h2 className="font-pacifico text-3xl text-center mb-8" style={{ color: "#e91e8c" }}>Best Sellers 🌟</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PRODUCTS.filter(p => p.badge === "Best Seller" || p.badge === "Fan Fave").slice(0, 4).map((product, i) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} added={addedId === product.id} delay={i * 100} />
                ))}
              </div>

              <div className="text-center mt-8">
                <button onClick={() => setPage("shop")} className="btn-pink px-8 py-3 font-bold">
                  View All Products →
                </button>
              </div>
            </div>
          </section>

          <section className="py-12 px-4 text-center" style={{ background: "linear-gradient(135deg, #fce4ec, #f8bbd9)" }}>
            <div className="max-w-2xl mx-auto">
              <div className="text-5xl mb-4">💌</div>
              <h3 className="font-pacifico text-2xl mb-3" style={{ color: "#e91e8c" }}>Free shipping on orders over $25!</h3>
              <p className="font-semibold" style={{ color: "#a0507a" }}>Handpacked with love & delivered to your door 🎀</p>
            </div>
          </section>
        </div>
      )}

      {/* ===== SHOP PAGE ===== */}
      {page === "shop" && (
        <div className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="font-pacifico text-4xl text-center mb-2" style={{ color: "#e91e8c" }}>The Shop ✨</h2>
          <p className="text-center font-semibold mb-8" style={{ color: "#a0507a" }}>Find your next fave accessory 💕</p>

          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${category === cat.key ? "btn-pink" : "btn-outline-pink"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} onAdd={addToCart} added={addedId === product.id} delay={i * 80} />
            ))}
          </div>
        </div>
      )}

      {/* ===== CART / CHECKOUT PAGE ===== */}
      {page === "cart" && (
        <div className="max-w-2xl mx-auto px-4 py-10">
          <h2 className="font-pacifico text-4xl text-center mb-8" style={{ color: "#e91e8c" }}>Checkout 🛍️</h2>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-bold text-lg mb-4" style={{ color: "#a0507a" }}>Your cart is empty!</p>
              <button onClick={() => setPage("shop")} className="btn-pink px-8 py-3">Shop Now ✨</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="product-card rounded-3xl p-6 space-y-3">
                <h3 className="font-bold text-lg mb-4" style={{ color: "#4a1030" }}>Order Summary</h3>
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: "#f8bbd9" }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `linear-gradient(135deg, ${(PRODUCT_COLORS[item.category] || ["#f9a8d4","#f472b6"])[0]}, ${(PRODUCT_COLORS[item.category] || ["#f9a8d4","#f472b6"])[1]})` }}>{item.emoji}</div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: "#4a1030" }}>{item.emoji} {item.name}</p>
                      <p className="text-xs" style={{ color: "#a0507a" }}>Qty: {item.qty}</p>
                    </div>
                    <p className="font-bold text-sm" style={{ color: "#e91e8c" }}>${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-xl pt-2" style={{ color: "#4a1030" }}>
                  <span>Total</span>
                  <span style={{ color: "#e91e8c" }}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="product-card rounded-3xl p-6 space-y-4">
                <h3 className="font-bold text-lg" style={{ color: "#4a1030" }}>Shipping Info 📦</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>First Name</label>
                    <input className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="Emma" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>Last Name</label>
                    <input className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="Smith" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>Email</label>
                  <input type="email" className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="emma@email.com" />
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>Street Address</label>
                  <input className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="123 Blossom Lane" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>City</label>
                    <input className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="LA" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>State</label>
                    <input className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="CA" />
                  </div>
                  <div>
                    <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>ZIP</label>
                    <input className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="90001" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1" style={{ color: "#a0507a" }}>Phone (optional)</label>
                  <input type="tel" className="w-full px-3 py-2 rounded-xl text-sm border focus:outline-none" style={{ borderColor: "#f8bbd9", fontFamily: "Nunito", color: "#4a1030" }} placeholder="+1 (555) 000-0000" />
                </div>
              </div>

              <button className="btn-pink w-full py-4 text-lg font-bold animate-pulse-pink">
                Place Order 💗
              </button>
              <p className="text-center text-xs font-semibold" style={{ color: "#a0507a" }}>🔒 Secure checkout — your info is safe with us</p>
            </div>
          )}
        </div>
      )}

      {/* ===== ABOUT PAGE ===== */}
      {page === "about" && (
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4 animate-float inline-block">🎀</div>
            <h2 className="font-pacifico text-4xl mb-4" style={{ color: "#e91e8c" }}>Our Story 💕</h2>
          </div>

          <div className="product-card rounded-3xl p-8 space-y-6">
            <p className="text-lg font-semibold leading-relaxed" style={{ color: "#4a1030" }}>
              Hi there! 💗 I started Pink Pop Shop because I absolutely love making aesthetic accessories that make everyday outfits more fun.
            </p>
            <p className="font-semibold leading-relaxed" style={{ color: "#7a3060" }}>
              Every piece is carefully picked with love — from the softest jelly bracelets to the cutest charm necklaces. I want every girl to feel like the main character of her own story, no matter what she's wearing.
            </p>
            <p className="font-semibold leading-relaxed" style={{ color: "#7a3060" }}>
              And yes — our reusable straws are as cute as they are good for the planet 🌍✨ Sip in style while saving the world, one pink straw at a time.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { emoji: "💗", label: "Made with love" },
                { emoji: "✨", label: "Aesthetic picks" },
                { emoji: "🌍", label: "Eco-friendly" },
              ].map(({ emoji, label }) => (
                <div key={label} className="text-center p-4 rounded-2xl" style={{ background: "#fce4ec" }}>
                  <div className="text-3xl mb-2">{emoji}</div>
                  <p className="text-xs font-bold" style={{ color: "#e91e8c" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-8">
            <button onClick={() => setPage("shop")} className="btn-pink px-8 py-4 text-base font-bold">
              Shop the Collection ✨
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center py-10 px-4 mt-10 border-t" style={{ borderColor: "#f8bbd9" }}>
        <p className="font-pacifico text-xl mb-2" style={{ color: "#e91e8c" }}>Pink Pop Shop 💗</p>
        <p className="text-sm font-semibold" style={{ color: "#a0507a" }}>pinkpopshop.com · Made with love & sparkles ✨</p>
        <div className="flex justify-center gap-6 mt-4">
          <button onClick={() => setPage("home")} className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: "#c06090" }}>Home</button>
          <button onClick={() => setPage("shop")} className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: "#c06090" }}>Shop</button>
          <button onClick={() => setPage("about")} className="text-sm font-semibold hover:opacity-70 transition-opacity" style={{ color: "#c06090" }}>About</button>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product, onAdd, added, delay }: { product: Product; onAdd: (p: Product) => void; added: boolean; delay: number }) {
  return (
    <div
      className="product-card rounded-3xl overflow-hidden animate-fade-in-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div className="relative w-full h-40 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${(PRODUCT_COLORS[product.category] || ["#f9a8d4","#f472b6"])[0]}, ${(PRODUCT_COLORS[product.category] || ["#f9a8d4","#f472b6"])[1]})` }}>
        <span className="text-5xl">{product.emoji}</span>
        {product.badge && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded-full" style={{ background: "#e91e8c", color: "white" }}>
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-bold text-sm leading-tight mb-1" style={{ color: "#4a1030" }}>{product.emoji} {product.name}</p>
        <p className="text-xs mb-3 leading-relaxed" style={{ color: "#a0507a" }}>{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-base" style={{ color: "#e91e8c" }}>${product.price.toFixed(2)}</span>
          <button
            onClick={() => onAdd(product)}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${added ? "text-white" : "btn-pink"}`}
            style={added ? { background: "#22c55e" } : {}}
          >
            {added ? "Added! ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}