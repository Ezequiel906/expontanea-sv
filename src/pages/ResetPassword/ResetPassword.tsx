import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import "./ResetPassword.css";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!token) {
      setError("El enlace de recuperación no es válido.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setError("");
      setMessage("");
      setLoading(true);

      await resetPassword(token, password);

      setMessage("Contraseña actualizada correctamente.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar la contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-card">
        <div className="reset-password-header">
          <span className="reset-password-brand">EXPONTANEA SV</span>

          <h1>Nueva contraseña</h1>

          <p>Crea una nueva contraseña para recuperar el acceso a tu cuenta.</p>
        </div>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="reset-password-field">
            <label htmlFor="password">Nueva contraseña</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="reset-password-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="reset-password-error">{error}</p>}

          {message && <p className="reset-password-message">{message}</p>}

          <button
            type="submit"
            className="reset-password-button"
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
