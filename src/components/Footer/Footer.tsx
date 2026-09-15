import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            EXPONTANEA <span>SV</span>
          </Link>

          <p>Flores que expresan lo que las palabras no pueden decir.</p>
        </div>

        <div className="footer-column">
          <h3>Explora</h3>

          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Catálogo</Link>
          <Link to="/nosotros">Nosotros</Link>
          <Link to="/contacto">Contacto</Link>
        </div>

        <div className="footer-column">
          <h3>Contacto</h3>

          <a href="tel:+50375289962">+503 75289962</a>
          <a href="mailto:@expontaneasv.com">@expontaneasv.com</a>
          <span>El Salvador</span>
        </div>

        <div className="footer-column">
          <h3>Síguenos</h3>

          <a
            href="https://www.instagram.com/expontanea_san_miguel?stkn=MTI2Nm05Mnk2em1pcQ=="
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://www.facebook.com/expontanea.expontanea/about"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>

          <a
            href="https://l.instagram.com/?u=https%3A%2F%2Fwa.me%2Fmessage%2FUEOAC523OFE7B1&e=AUCxsuVfgQ0lRjkJGsS0m48v0SimzS81WaT7JkrrYXpAOQ-vGo1JoyLbdl9Vjy3XkFp6MEzJaFMdempPM6IkosZHuoOaHcaeatlhXuQpVg1li6KtKAm5DWJ4FgrTxA4bboC-E3eKSj17LaDwVnn81A"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© 2026 EXPONTANEA SV. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
