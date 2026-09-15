import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import PublicFeedback from "../../components/PublicFeedback/PublicFeedback";
import type { Product } from "../../types/product";
import { getProducts } from "../../services/productService";
import "./Catalog.css";

function Catalog() {
  const [searchParams] = useSearchParams();
  const occasion = searchParams.get("ocasion");
  const occasionNames: Record<string, string> = {
    cumpleanos: "Cumpleaños",
    bodas: "Bodas",
    "san-valentin": "San Valentín",
    condolencias: "Condolencias",
  };
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const effectiveCategory = occasion ? "Todos" : category;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(occasion ?? undefined);
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("No pudimos cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [occasion]);

  const categories = [
    "Todos",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        effectiveCategory === "Todos" ||
        product.category === effectiveCategory;

      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [products, search, effectiveCategory, sort]);

  return (
    <div className="catalog-page">
      <div className="container">
        <div className="catalog-header">
          <span className="section-eyebrow">Nuestra colección</span>

          <h1>
            {occasion && occasionNames[occasion]
              ? occasionNames[occasion]
              : "Encuentra algo"}
            <span>{occasion ? "" : " especial."}</span>
          </h1>

          <p>
            {occasion && occasionNames[occasion]
              ? `Descubre nuestros arreglos pensados para ${occasionNames[
                  occasion
                ].toLowerCase()}.`
              : "Explora nuestros arreglos, ramos y detalles pensados para acompañar cada momento."}
          </p>
        </div>

        <div className="catalog-toolbar">
          <div className="catalog-search">
            <input
              type="text"
              placeholder="Buscar flores..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="catalog-filters">
            {!occasion && (
              <div className="catalog-categories">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="catalog-sort"
            >
              <option value="default">Ordenar por</option>
              <option value="price-low">Precio: menor a mayor</option>
              <option value="price-high">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {loading && (
          <PublicFeedback type="loading" title="Cargando productos..." />
        )}

        {error && !loading && (
          <PublicFeedback
            type="error"
            title={error}
            message="Intenta recargar la página en unos segundos."
          />
        )}

        {!loading && !error && (
          <>
            <div className="catalog-results">
              <span>
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "producto" : "productos"}
              </span>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="catalog-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <PublicFeedback
                type="empty"
                title="No encontramos flores."
                message="Prueba con otro nombre o selecciona una categoría diferente."
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Catalog;
