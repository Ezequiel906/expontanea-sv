import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";
import { getUsers, type User } from "../../services/userService";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";

import "./AdminUsers.css";

function AdminUsers() {
  const { token } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getUsers(token);
        setUsers(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error);

        setError("No pudimos cargar los clientes.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token]);

  if (loading) {
    return <AdminFeedback type="loading" title="Cargando clientes..." />;
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
    <div className="admin-users">
      <div className="admin-page-header">
        <div>
          <h1>Clientes</h1>
          <p>Gestiona los clientes de EXPONTANEA SV.</p>
        </div>

        <span>
          {users.length} {users.length === 1 ? "cliente" : "clientes"}
        </span>
      </div>

      <div className="admin-users-table-container">
        <table className="admin-users-table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Pedidos</th>
              <th>Registro</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>{user.name}</strong>
                </td>
                <td>{user.email}</td>
                <td>{user.role === "ADMIN" ? "Administrador" : "Cliente"}</td>
                <td>{user.ordersCount ?? 0}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("es-SV")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;
