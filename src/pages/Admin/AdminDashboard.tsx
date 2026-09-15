import { useEffect, useState } from "react";
import "./AdminDashboard.css";
import { useAuth } from "../../context/useAuth";
import {
  getDashboardStats,
  type DashboardStats,
} from "../../services/dashboardService";
import { orderStatusLabels } from "../../utils/orderStatus";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";

function AdminDashboard() {
  const { token } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getDashboardStats(token);

        setStats(data);
      } catch (error) {
        console.error("Error al cargar estadísticas:", error);

        setError("No pudimos cargar las estadísticas.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  if (loading) {
    return <AdminFeedback type="loading" title="Cargando dashboard..." />;
  }

  if (error || !stats) {
    return (
      <AdminFeedback
        type="error"
        title={error || "No pudimos cargar el dashboard."}
        message="Intenta recargar la página o vuelve a iniciar sesión."
      />
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Dashboard</h1>
        <p>Resumen general de EXPONTANEA SV.</p>
      </div>

      <div className="admin-dashboard-stats">
        <div className="admin-stat-card">
          <span>Pedidos</span>
          <strong>{stats.totalOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Pendientes</span>
          <strong>{stats.pendingOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Entregados</span>
          <strong>{stats.deliveredOrders}</strong>
        </div>

        <div className="admin-stat-card">
          <span>Ventas</span>
          <strong>${stats.totalSales.toFixed(2)}</strong>
        </div>
      </div>

      <section className="admin-recent-orders">
        <div className="admin-recent-orders-header">
          <h2>Pedidos recientes</h2>
        </div>

        <div className="admin-recent-orders-list">
          {stats.recentOrders.map((order) => (
            <div key={order.id} className="admin-recent-order">
              <div>
                <strong>#{order.id}</strong>
                <span>{order.customerName}</span>
              </div>

              <span>${order.total.toFixed(2)}</span>

              <span>{orderStatusLabels[order.status]}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;

