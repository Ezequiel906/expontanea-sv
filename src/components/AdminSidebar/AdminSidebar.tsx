import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  Package,
  ShoppingBag,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import "./AdminSidebar.css";

function AdminSidebar() {
  const { logout } = useAuth();
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header">
        <h2>EXPONTANEA SV</h2>
        <span>Administración</span>
      </div>

      <nav className="admin-sidebar-nav">
        <Link to="/admin">
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        <Link to="/admin/pedidos">
          <ShoppingBag size={18} />
          Pedidos
        </Link>

        <Link to="/admin/productos">
          <Package size={18} />
          Productos
        </Link>

        <Link to="/admin/clientes">
          <Users size={18} />
          Clientes
        </Link>

        <Link to="/admin/mensajes">
          <Mail size={18} />
          Mensajes
        </Link>
      </nav>
      <button
        type="button"
        onClick={() => logout("ADMIN")}
        className="admin-sidebar-logout"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}

export default AdminSidebar;
