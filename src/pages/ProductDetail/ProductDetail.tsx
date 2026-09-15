import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

import PublicFeedback from "../../components/PublicFeedback/PublicFeedback";
import type { Product } from "../../types/product";
import { getProductById } from "../../services/productService";
import { useCart } from "../../context/useCart";
import { resolveProductImage } from "../../utils/productImage";

import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addToCart } = useCart();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (error) {
        console.error("Error al cargar producto:", error);
        setError("No pudimos cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <PublicFeedback type="loading" title="Cargando producto..." />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <PublicFeedback
            type="error"
            title={error || "Producto no encontrado."}
            message="Intenta volver al catálogo y seleccionar otro producto."
          >
            <Link to="/catalogo">
              <ArrowLeft size={18} />
              Volver al catálogo
            </Link>
          </PublicFeedback>
        </div>
      </div>
    );
  }

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  return (
    <div className="product-detail-page">
      <div className="container">
        <Link to="/catalogo" className="product-back-link">
          <ArrowLeft size={18} strokeWidth={1.8} />
          Volver al catálogo
        </Link>

        <div className="product-detail">
          <div className="product-detail-image">
            <img src={resolveProductImage(product.image)} alt={product.name} />
          </div>

          <div className="product-detail-content">
            <span className="product-detail-category">{product.category}</span>

            <h1>{product.name}</h1>

            <span className="product-detail-price">
              ${product.price.toFixed(2)}
            </span>

            <p className="product-detail-description">{product.description}</p>

            <div className="product-detail-divider"></div>

            <div className="product-quantity">
              <span>Cantidad</span>

              <div className="quantity-control">
                <button
                  onClick={decreaseQuantity}
                  aria-label="Disminuir cantidad"
                >
                  <Minus size={16} />
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  aria-label="Aumentar cantidad"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              className="product-add-button"
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag size={18} strokeWidth={1.8} />
              Agregar al carrito
            </button>

            <div className="product-info">
              <div>
                <strong>Flores frescas</strong>
                <span>Seleccionadas cuidadosamente para cada arreglo.</span>
              </div>

              <div>
                <strong>Preparado con intención</strong>
                <span>Cada pedido es preparado especialmente para ti.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
