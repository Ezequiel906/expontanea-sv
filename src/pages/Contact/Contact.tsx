import { useState } from "react";
import { Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { sendContactMessage } from "../../services/contactService";

import "./Contact.css";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Completa todos los campos para enviar tu mensaje.");
      setStatusMessage("");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Ingresa un correo válido.");
      setStatusMessage("");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStatusMessage("");

      await sendContactMessage({
        name,
        email,
        subject,
        message,
      });

      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setStatusMessage("Tu mensaje fue enviado correctamente.");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo enviar el mensaje.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="container">
          <span className="section-eyebrow">Estamos para ti</span>

          <h1>
            Hablemos de
            <span> flores.</span>
          </h1>

          <p>
            ¿Tienes alguna pregunta, quieres hacer un pedido especial o
            simplemente quieres saludarnos? Escríbenos.
          </p>
        </div>
      </section>

      <section className="contact-content">
        <div className="container contact-grid">
          <div className="contact-info">
            <span className="section-eyebrow">Contacto</span>

            <h2>
              Nos encantará
              <span> escucharte.</span>
            </h2>

            <div className="contact-details">
              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <MessageCircle size={20} strokeWidth={1.7} />
                </div>

                <div>
                  <strong>WhatsApp</strong>
                  <span>+503 75289962</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <Mail size={20} strokeWidth={1.7} />
                </div>

                <div>
                  <strong>Correo</strong>
                  <span>@expontanea.com</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <MapPin size={20} strokeWidth={1.7} />
                </div>

                <div>
                  <strong>Ubicación</strong>
                  <span>San Miguel, El Salvador</span>
                </div>
              </div>

              <div className="contact-detail">
                <div className="contact-detail-icon">
                  <Clock size={20} strokeWidth={1.7} />
                </div>

                <div>
                  <strong>Horario</strong>
                  <span>Lunes - Sábado · 8:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-row">
                <div className="contact-field">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>

                <div className="contact-field">
                  <label htmlFor="email">Correo</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="subject">Asunto</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                />
              </div>

              <div className="contact-field">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Cuéntanos un poco más..."
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                />
              </div>

              {error && <p className="contact-error">{error}</p>}
              {statusMessage && (
                <p className="contact-success">{statusMessage}</p>
              )}

              <button
                type="submit"
                className="contact-submit"
                disabled={loading}
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
