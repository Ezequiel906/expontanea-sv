import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";
import "./AdminOrders.css";
import type { AdminOrder } from "../../types/adminOrder";
import { getAdminOrders } from "../../services/AdminOrderService";
import { Link } from "react-router-dom";
import { orderStatusLabels } from "../../utils/orderStatus";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";

function AdminOrders() {
  const { token } = useAuth();

  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getAdminOrders(token);

        setOrders(data);
      } catch (error) {
        console.error("Error al cargar pedidos:", error);
        setError("No pudimos cargar los pedidos.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  if (loading) {
    return <AdminFeedback type="loading" title="Cargando pedidos..." />;
  }

  if (error) {
    return (
      <AdminFeedback
        type="error"
        title={error}
        message="Intenta recargar la página o vuelve a iniciar sesión."
      />
    );
  }

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <div>
          <h1>Pedidos</h1>
          <p>Gestiona los pedidos de EXPONTANEA SV.</p>
        </div>

        <span>
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      <div className="admin-orders-table-container">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Pedido</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Entrega</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>

                <td>
                  <strong>{order.customerName}</strong>
                  <span>{order.email}</span>
                </td>

                <td>{new Date(order.createdAt).toLocaleDateString("es-SV")}</td>

                <td>
                  {order.deliveryType === "delivery" ? "Domicilio" : "Recoger"}
                </td>

                <td>${order.total.toFixed(2)}</td>

                <td>{orderStatusLabels[order.status]}</td>

                <td>
                  <Link to={`/admin/pedidos/${order.id}`}>Ver detalle</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;
