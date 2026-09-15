import { useEffect, useState } from "react";

import { useAuth } from "../../context/useAuth";
import { deleteProduct, getProducts } from "../../services/productService";
import type { Product } from "../../types/product";
import { useNavigate } from "react-router-dom";
import "./AdminProducts.css";
import Swal from "sweetalert2";
import AdminFeedback from "../../components/AdminFeedback/AdminFeedback";

function AdminProducts() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      if (!token) {
        return;
      }

      try {
        const data = await getProducts();

        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);

        setError("No pudimos cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [token]);

  const handleDelete = async (product: Product) => {
    if (!token) return;

    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      text: `Se eliminará "${product.name}" del catálogo.`,
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await deleteProduct(token, product.id);

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) => currentProduct.id !== product.id,
        ),
      );

      await Swal.fire({
        icon: "success",
        title: "Producto eliminado",
        text: "El producto se eliminó correctamente.",
        confirmButtonText: "Aceptar",
      });
    } catch (error) {
      console.error("Error al eliminar producto:", error);

      await Swal.fire({
        icon: "error",
        title: "No se pudo eliminar",
        text: "Ocurrió un error al eliminar el producto. Inténtalo nuevamente.",
        confirmButtonText: "Entendido",
      });
    }
  };

  if (loading) {
    return <AdminFeedback type="loading" title="Cargando productos..." />;
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
    <div className="admin-products">
      <div className="admin-page-header">
        <div>
          <h1>Productos</h1>
          <p>Gestiona los productos de EXPONTANEA SV.</p>
        </div>

        <div className="admin-products-header-actions">
          <span>
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </span>

          <button
            type="button"
            onClick={() => navigate("/admin/productos/nuevo")}
          >
            Nuevo producto
          </button>
        </div>
      </div>

      <div className="admin-products-table-container">
        <table className="admin-products-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>

                <td>{product.category}</td>

                <td>${product.price.toFixed(2)}</td>

                <td>{product.featured ? "Sí" : "No"}</td>
                <td>
                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="edit-button"
                      onClick={() =>
                        navigate(`/admin/productos/${product.id}/editar`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() => handleDelete(product)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProducts;
