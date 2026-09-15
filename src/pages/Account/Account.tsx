import { Link } from "react-router-dom";
import { CalendarDays, Package, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import PublicFeedback from "../../components/PublicFeedback/PublicFeedback";
import { useAuth } from "../../context/useAuth";
import { getMyOrders } from "../../services/orderService";
import type { AdminOrder } from "../../types/adminOrder";
import { orderStatusLabels } from "../../utils/orderStatus";
import "./Account.css";

function Account() {
  const { customerToken, customerUser, logout } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!customerToken) {
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders(customerToken);
        setOrders(data);
      } catch (error) {
        console.error("Error al cargar pedidos del cliente:", error);
        setError("No pudimos cargar tus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [customerToken]);

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + order.total, 0),
    [orders],
  );

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-header">
          <div>
            <span className="section-eyebrow">Mi cuenta</span>
            <h1>
              Hola,
              <span> {customerUser?.name ?? "bienvenido"}.</span>
            </h1>
            <p>Consulta tus pedidos y el estado de tus compras.</p>
          </div>

          <button type="button" onClick={() => logout("CUSTOMER")}>
            Cerrar sesión
          </button>
        </div>

        <div className="account-stats">
          <div className="account-stat">
            <ShoppingBag size={20} />
            <span>Pedidos</span>
            <strong>{orders.length}</strong>
          </div>

          <div className="account-stat">
            <Package size={20} />
            <span>Total comprado</span>
            <strong>${totalSpent.toFixed(2)}</strong>
          </div>

          <div className="account-stat">
            <CalendarDays size={20} />
            <span>Correo</span>
            <strong>{customerUser?.email}</strong>
          </div>
        </div>

        {loading && (
          <PublicFeedback type="loading" title="Cargando tus pedidos..." />
        )}

        {error && !loading && (
          <PublicFeedback
            type="error"
            title={error}
            message="Intenta recargar la página o vuelve a iniciar sesión."
          />
        )}

        {!loading && !error && orders.length === 0 && (
          <PublicFeedback
            type="empty"
            title="Aún no tienes pedidos."
            message="Cuando completes una compra, aparecerá en este historial."
          >
            <Link to="/catalogo">Explorar catálogo</Link>
          </PublicFeedback>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="account-orders">
            {orders.map((order) => (
              <article className="account-order" key={order.id}>
                <div className="account-order-header">
                  <div>
                    <span>Pedido #{order.id}</span>
                    <strong>
                      {new Date(order.createdAt).toLocaleDateString("es-SV", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </div>

                  <span className={`account-order-status ${order.status}`}>
                    {orderStatusLabels[order.status]}
                  </span>
                </div>

                <div className="account-order-items">
                  {order.items.map((item) => (
                    <div className="account-order-item" key={item.id}>
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

                <div className="account-order-footer">
                  <span>
                    {order.deliveryType === "delivery"
                      ? "Entrega a domicilio"
                      : "Recoger en tienda"}
                  </span>

                  <strong>${order.total.toFixed(2)}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
