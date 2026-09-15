import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "../../context/useCart";
import { resolveProductImage } from "../../utils/productImage";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    cartTotal,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container cart-empty">
          <span className="section-eyebrow">Tu carrito</span>

          <h1>Tu carrito está vacío.</h1>

          <p>
            Parece que todavía no has elegido tus flores.
          </p>

          <Link to="/catalogo" className="cart-empty-button">
            Explorar catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <span className="section-eyebrow">Tu carrito</span>

          <h1>
            Tus flores
            <span> elegidas.</span>
          </h1>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.product.id}>
                <img
                  src={resolveProductImage(item.product.image)}
                  alt={item.product.name}
                />

                <div className="cart-item-info">
                  <span>{item.product.category}</span>

                  <h2>{item.product.name}</h2>

                  <p>
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1
                        )
                      }
                    >
                      <Minus size={14} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <button
                    className="cart-remove"
                    onClick={() =>
                      removeFromCart(item.product.id)
                    }
                    aria-label={`Eliminar ${item.product.name}`}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>

                <strong className="cart-item-total">
                  $
                  {(
                    item.product.price * item.quantity
                  ).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <aside className="cart-summary">
            <h2>Resumen</h2>

            <div className="cart-summary-row">
              <span>Subtotal</span>

              <strong>
                ${cartTotal.toFixed(2)}
              </strong>
            </div>

            <div className="cart-summary-row">
              <span>Envío</span>

              <span>Por calcular</span>
            </div>

            <div className="cart-summary-divider"></div>

            <div className="cart-summary-total">
              <span>Total</span>

              <strong>
                ${cartTotal.toFixed(2)}
              </strong>
            </div>

            <Link
  to="/checkout"
  className="cart-checkout-button"
>
  Continuar pedido
</Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
