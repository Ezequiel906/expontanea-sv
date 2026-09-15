import { ArrowUpRight } from "lucide-react";
import type { Product } from "../../types/product";
import "./ProductCard.css";
import { Link } from "react-router-dom";
import { resolveProductImage } from "../../utils/productImage";

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="product-card">
      <div className="product-card-image-container">
        <img
          src={resolveProductImage(product.image)}
          alt={product.name}
          className="product-card-image"
        />

      <Link
        to={`/catalogo/${product.id}`}
        className="product-card-button"
        aria-label={`Ver ${product.name}`}
      >
      <ArrowUpRight size={18} strokeWidth={1.8} />
      </Link>
      </div>

      <div className="product-card-info">
        <div>
          <span className="product-card-category">
            {product.category}
          </span>

          <h3>{product.name}</h3>
        </div>

        <span className="product-card-price">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </article>
  );
}

export default ProductCard;
