import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../services/authService";
import "./ForgotPassword.css";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");
      setMessage("");
      setLoading(true);

      await requestPasswordReset(email);

      setMessage("Hemos enviado un enlace para recuperar tu contraseña.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo procesar la solicitud"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <span className="forgot-password-brand">EXPONTANEA SV</span>

          <h1>Recuperar contraseña</h1>

          <p>
            Ingresa tu correo y te enviaremos un enlace para restablecer tu
            contraseña.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="forgot-password-form">
          <div className="forgot-password-field">
            <label htmlFor="email">Correo electrónico</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          {error && <p className="forgot-password-error">{error}</p>}

          {message && <p className="forgot-password-message">{message}</p>}

          <button
            type="submit"
            className="forgot-password-button"
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>

        <div className="forgot-password-footer">
          <button type="button" onClick={() => navigate("/login")}>
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
