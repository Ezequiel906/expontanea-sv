import { useState } from "react";
import { useAuth } from "../../context/useAuth";
import { login } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const { login: saveLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof location.state.from === "string"
      ? location.state.from
      : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setError("");

      const result = await login({
        email,
        password,
      });

      saveLogin(result.token, result.user);

      if (result.user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate(from.startsWith("/admin") ? "/" : from);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al iniciar sesión",
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-background" />
      <div className="login-card">
        <div className="login-header">
          <span className="login-brand">EXPONTANEA SV</span>

          <h1>Bienvenido</h1>

          <p>Ingresa a tu cuenta para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
          </div>

          <div className="login-forgot">
            <button type="button" onClick={() => navigate("/forgot-password")}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-button">
            Iniciar sesión
          </button>
        </form>
        <div className="login-footer">
          <span>¿No tienes una cuenta?</span>

          <button type="button" onClick={() => navigate("/register")}>
            Crear cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
