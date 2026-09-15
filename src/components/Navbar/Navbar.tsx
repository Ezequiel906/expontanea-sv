import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ShoppingBag, User, X } from "lucide-react";

import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";
import { resolveProductImage } from "../../utils/productImage";

import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { adminUser, customerUser } = useAuth();
  const accountPath = customerUser ? "/cuenta" : adminUser ? "/admin" : "/login";
  const accountLabel = customerUser ? "Cuenta" : adminUser ? "Admin" : "Entrar";
  const accountAriaLabel = adminUser && !customerUser
    ? "Panel de administración"
    : customerUser
      ? "Mi cuenta"
      : "Iniciar sesión";

  const { cartItems, cartCount, cartTotal } = useCart();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          EXPONTANEA <span>SV</span>
        </Link>

        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="navbar-actions">
          <div className="navbar-cart-wrapper">
            <Link
              to="/carrito"
              className="navbar-cart"
              aria-label={`Carrito de compras, ${cartCount} productos`}
              onClick={closeMenu}
            >
              <ShoppingBag size={20} strokeWidth={1.8} />

              {cartCount > 0 && (
                <span className="navbar-cart-count">{cartCount}</span>
              )}
            </Link>

            {cartItems.length > 0 && (
              <div className="navbar-mini-cart">
                <div className="navbar-mini-cart-header">
                  <strong>Tu carrito</strong>

                  <span>
                    {cartCount} {cartCount === 1 ? "producto" : "productos"}
                  </span>
                </div>

                <div className="navbar-mini-cart-items">
                  {cartItems.map((item) => (
                    <div
                      className="navbar-mini-cart-item"
                      key={item.product.id}
                    >
                      <img
                        src={resolveProductImage(item.product.image)}
                        alt={item.product.name}
                      />

                      <div className="navbar-mini-cart-info">
                        <strong>{item.product.name}</strong>

                        <span>
                          {item.quantity} x ${item.product.price.toFixed(2)}
                        </span>
                      </div>

                      <strong>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </strong>
                    </div>
                  ))}
                </div>

                <div className="navbar-mini-cart-divider" />

                <div className="navbar-mini-cart-total">
                  <span>Subtotal</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>

                <Link
                  to="/carrito"
                  className="navbar-mini-cart-button"
                  onClick={closeMenu}
                >
                  Ver carrito
                </Link>
              </div>
            )}
          </div>

          <Link
            to={accountPath}
            className="navbar-account"
            aria-label={accountAriaLabel}
            onClick={closeMenu}
          >
            <User size={19} strokeWidth={1.8} />
            <span>{accountLabel}</span>
          </Link>

          <button
            className={`navbar-menu-button ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X size={24} strokeWidth={1.8} />
            ) : (
              <Menu size={24} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar-mobile-menu">
          <Link to="/" onClick={closeMenu}>
            Inicio
          </Link>

          <Link to="/catalogo" onClick={closeMenu}>
            Catálogo
          </Link>

          <Link to="/nosotros" onClick={closeMenu}>
            Nosotros
          </Link>

          <Link to="/contacto" onClick={closeMenu}>
            Contacto
          </Link>

          <Link to={accountPath} onClick={closeMenu}>
            {customerUser
              ? "Mi cuenta"
              : adminUser
                ? "Panel admin"
                : "Iniciar sesión"}
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
