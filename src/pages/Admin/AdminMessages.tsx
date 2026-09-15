import { useEffect, useState } from "react";
import { useAuth } from "../../context/useAuth";
import {
  getContactMessages,
  markContactMessageAsRead,
  type ContactMessage,
} from "../../services/adminContactService";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";
import "./AdminMessages.css";

function AdminMessages() {
  const { token } = useAuth();

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getContactMessages(token);
        setMessages(data);
        setSelectedMessage(data[0] ?? null);
      } catch (error) {
        console.error("Error al cargar mensajes:", error);

        setError("No pudimos cargar los mensajes.");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [token]);

  const handleMarkAsRead = async () => {
    if (!token || !selectedMessage || selectedMessage.isRead) {
      return;
    }

    try {
      setUpdating(true);
      setError("");

      const updatedMessage = await markContactMessageAsRead(
        token,
        selectedMessage.id,
      );

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === updatedMessage.id ? updatedMessage : message,
        ),
      );
      setSelectedMessage(updatedMessage);
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error);
      setError("No pudimos actualizar el mensaje.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <AdminFeedback type="loading" title="Cargando mensajes..." />;
  }

  if (error && messages.length === 0) {
    return (
      <AdminFeedback
        type="error"
        title={error}
        message="Intenta recargar la página o vuelve a iniciar sesión."
      />
    );
  }

  return (
    <div className="admin-messages">
      <div className="admin-page-header">
        <div>
          <h1>Mensajes</h1>
          <p>Consulta los mensajes enviados desde Hablemos.</p>
        </div>

        <span>
          {messages.length} {messages.length === 1 ? "mensaje" : "mensajes"}
        </span>
      </div>

      {messages.length === 0 ? (
        <AdminFeedback
          type="empty"
          title="No hay mensajes todavía."
          message="Cuando alguien escriba desde Hablemos, aparecerá aquí."
        />
      ) : (
        <div className="admin-messages-layout">
          <div className="admin-messages-list">
            {messages.map((message) => (
              <button
                type="button"
                key={message.id}
                className={`admin-message-item ${
                  selectedMessage?.id === message.id ? "active" : ""
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <div>
                  <strong>{message.name}</strong>
                  <span>{message.subject}</span>
                </div>

                <div className="admin-message-meta">
                  <span>
                    {new Date(message.createdAt).toLocaleDateString("es-SV")}
                  </span>
                  <span
                    className={`admin-message-status ${
                      message.isRead ? "read" : "new"
                    }`}
                  >
                    {message.isRead ? "Leído" : "Nuevo"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedMessage && (
            <section className="admin-message-detail">
              <div className="admin-message-detail-header">
                <div>
                  <span
                    className={`admin-message-status ${
                      selectedMessage.isRead ? "read" : "new"
                    }`}
                  >
                    {selectedMessage.isRead ? "Leído" : "Nuevo"}
                  </span>

                  <h2>{selectedMessage.subject}</h2>
                </div>

                <button
                  type="button"
                  onClick={handleMarkAsRead}
                  disabled={selectedMessage.isRead || updating}
                >
                  {updating ? "Actualizando..." : "Marcar como leído"}
                </button>
              </div>

              <div className="admin-message-info">
                <div>
                  <span>Nombre</span>
                  <strong>{selectedMessage.name}</strong>
                </div>

                <div>
                  <span>Email</span>
                  <strong>{selectedMessage.email}</strong>
                </div>

                <div>
                  <span>Fecha</span>
                  <strong>
                    {new Date(selectedMessage.createdAt).toLocaleString(
                      "es-SV",
                    )}
                  </strong>
                </div>
              </div>

              <div className="admin-message-body">
                <span>Mensaje</span>
                <p>{selectedMessage.message}</p>
              </div>
            </section>
          )}
        </div>
      )}

      {error && messages.length > 0 && (
        <AdminFeedback
          type="error"
          title={error}
          message="El listado sigue disponible, pero no se pudo completar la acción."
        />
      )}
    </div>
  );
}

export default AdminMessages;
