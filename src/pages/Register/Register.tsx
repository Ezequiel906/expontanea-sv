import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { register } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setError("");

      await register({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al crear la cuenta",
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <span className="register-brand">EXPONTANEA SV</span>

          <h1>Crear cuenta</h1>

          <p>Regístrate para realizar tus pedidos.</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="register-field">
            <label htmlFor="name">Nombre</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Tu nombre"
            />
          </div>

          <div className="register-field">
            <label htmlFor="email">Correo electrónico</label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="tu@correo.com"
            />
          </div>

          <div className="register-field">
            <label htmlFor="password">Contraseña</label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="register-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>

            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="register-error">{error}</p>}

          <button type="submit" className="register-button">
            Crear cuenta
          </button>
        </form>

        <div className="register-footer">
          <span>¿Ya tienes una cuenta?</span>

          <button type="button" onClick={() => navigate("/login")}>
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
