import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import "./AdminOrderDetail.css";
import { useAuth } from "../../context/useAuth";
import type { AdminOrder } from "../../types/adminOrder";
import {
  getAdminOrderById,
  updateOrderStatus,
} from "../../services/AdminOrderService";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";

function AdminOrderDetail() {
  const { id } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!token || !id) {
        return;
      }

      try {
        const data = await getAdminOrderById(token, Number(id));
        setOrder(data);
      } catch (error) {
        console.error("Error al cargar pedido:", error);

        setError("No pudimos cargar el pedido.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, token]);

  if (loading) {
    return <AdminFeedback type="loading" title="Cargando pedido..." />;
  }

  if (error || !order) {
    return (
      <AdminFeedback
        type="error"
        title={error || "Pedido no encontrado."}
        message="Intenta recargar la página o vuelve al listado de pedidos."
      >
        <Link to="/admin/pedidos">
          <ArrowLeft size={18} />
          Volver a pedidos
        </Link>
      </AdminFeedback>
    );
  }

  return (
    <div className="admin-order-detail">
      <div className="admin-order-detail-header">
        <div>
          <Link to="/admin/pedidos" className="admin-order-back-link">
            <ArrowLeft size={18} />
            Volver a pedidos
          </Link>

          <h1>Pedido #{order.id}</h1>
          <p>
            {new Date(order.createdAt).toLocaleDateString("es-SV", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="admin-order-status">
          <label htmlFor="order-status">Estado</label>

          <select
            id="order-status"
            value={order.status}
            onChange={async (event) => {
              if (!token) {
                return;
              }

              try {
                const updatedOrder = await updateOrderStatus(
                  token,
                  order.id,
                  event.target.value as AdminOrder["status"],
                );

                setOrder(updatedOrder);
              } catch (error) {
                console.error("Error al actualizar estado:", error);

                await Swal.fire({
                  icon: "error",
                  title: "No se pudo actualizar el pedido",
                  text: "Ocurrió un error al cambiar el estado. Inténtalo nuevamente.",
                  confirmButtonText: "Entendido",
                });
              }
            }}
          >
            <option value="PENDING">Pendiente</option>
            <option value="CONFIRMED">Confirmado</option>
            <option value="PREPARING">Preparando</option>
            <option value="SHIPPED">Enviado</option>
            <option value="DELIVERED">Entregado</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="admin-order-detail-grid">
        <section className="admin-order-card">
          <h2>Información del cliente</h2>

          <div className="admin-order-info">
            <div>
              <span>Nombre</span>
              <strong>{order.customerName}</strong>
            </div>

            <div>
              <span>Correo</span>
              <strong>{order.email}</strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>{order.phone}</strong>
            </div>
          </div>
        </section>

        <section className="admin-order-card">
          <h2>Información de entrega</h2>

          <div className="admin-order-info">
            <div>
              <span>Tipo de entrega</span>
              <strong>
                {order.deliveryType === "delivery"
                  ? "Domicilio"
                  : "Recoger en tienda"}
              </strong>
            </div>

            {order.deliveryType === "delivery" && (
              <>
                <div>
                  <span>Dirección</span>
                  <strong>{order.address}</strong>
                </div>

                <div>
                  <span>Ciudad</span>
                  <strong>{order.city}</strong>
                </div>
              </>
            )}
          </div>
        </section>

        <section className="admin-order-card admin-order-products">
          <h2>Productos</h2>

          <div className="admin-order-product-list">
            {order.items.map((item) => (
              <div key={item.id} className="admin-order-product">
                <div>
                  <strong>{item.name}</strong>

                  <span>
                    {item.quantity} x ${item.price.toFixed(2)}
                  </span>
                </div>

                <strong>${(item.price * item.quantity).toFixed(2)}</strong>
              </div>
            ))}
          </div>

          <div className="admin-order-total">
            <span>Total</span>
            <strong>${order.total.toFixed(2)}</strong>
          </div>
        </section>

        {order.notes && (
          <section className="admin-order-card">
            <h2>Notas del cliente</h2>
            <p className="admin-order-notes">{order.notes}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export default AdminOrderDetail;
