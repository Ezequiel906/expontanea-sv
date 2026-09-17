import "./Home.css";
import CategoryCard from "../../components/CategoryCard/CategoryCard";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useEffect, useState } from "react";
import type { Product } from "../../types/product";
import { getProducts } from "../../services/productService";
import Ocassions from "../../components/Ocassions/Ocassions";

function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos destacados:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);
  return (
    <div className="home">
      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-eyebrow">Flores con intención</span>

            <h1>
              Flores que hablan
              <span> sin decir una palabra.</span>
            </h1>

            <p>
              Creamos arreglos florales pensados para acompañar momentos que
              merecen ser recordados.
            </p>

            <div className="hero-actions">
              <a href="/catalogo" className="hero-button hero-button-primary">
                Ver catálogo
              </a>

              <a href="/contacto" className="hero-button hero-button-secondary">
                Contáctanos
              </a>
            </div>
          </div>

          <div className="hero-image">
            <div className="hero-image-placeholder">
              <span>EXPONTANEA SV</span>
            </div>
          </div>
        </div>
      </section>
      <section className="categories-section">
        <div className="container">
          <div className="section-heading">
            <span className="section-eyebrow">Nuestra colección</span>

            <h2>
              Encuentra flores para
              <span> cada momento.</span>
            </h2>

            <p>
              Desde un detalle sencillo hasta un arreglo para una ocasión
              especial.
            </p>
          </div>

          <div className="categories-grid">
            <CategoryCard
              title="Ramos"
              description="Detalles que dicen mucho"
              image="https://i.pinimg.com/736x/b0/24/fa/b024fa7f93647b26101ff096a8bdb740.jpg"
              href="/catalogo?categoria=ramos"
            />

            <CategoryCard
              title="Arreglos"
              description="Diseños para momentos especiales"
              image="https://i.pinimg.com/1200x/74/88/5f/74885f7f2e8aa457250560c76a43845f.jpg"
              href="/catalogo?categoria=arreglos"
            />

            <CategoryCard
              title="Regalos"
              description="Un detalle para hacer sonreír"
              image="https://i.pinimg.com/736x/9c/75/da/9c75da6ea79178e1cd854b7d7358a131.jpg"
              href="/catalogo?categoria=regalos"
            />
          </div>
        </div>
      </section>
      <Ocassions />
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <div className="section-heading">
              <span className="section-eyebrow">Nuestros favoritos</span>

              <h2>
                Flores que hacen
                <span> la diferencia.</span>
              </h2>

              <p>Descubre algunos de nuestros arreglos más especiales.</p>
            </div>

            <Link to="/catalogo" className="featured-link">
              Ver todo
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
          </div>

          <div className="products-grid">
            {loading ? (
              <p>Cargando productos...</p>
            ) : (
              products
                .filter((product) => product.featured)
                .slice(0, 4)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
            )}
          </div>
        </div>
      </section>
      <section className="about-preview-section">
        <div className="container about-preview-container">
          <div className="about-preview-image">
            <img
              src="https://images.unsplash.com/photo-1495231916356-a86217efff12"
              alt="Arreglo floral de EXPONTANEA SV"
            />
          </div>

          <div className="about-preview-content">
            <span className="section-eyebrow">Nuestra esencia</span>

            <h2>
              Flores con
              <span> intención.</span>
            </h2>

            <p>
              En EXPONTANEA creemos que las flores tienen una forma especial de
              decir aquello que a veces las palabras no pueden.
            </p>

            <p>
              Creamos arreglos cuidadosamente seleccionados para acompañar
              celebraciones, sorpresas y esos pequeños momentos que merecen
              convertirse en recuerdos.
            </p>

            <Link to="/nosotros" className="about-preview-link">
              Conócenos
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <span className="section-eyebrow">¿Tienes algo en mente?</span>

            <h2>
              Hagamos que ese momento
              <span> florezca.</span>
            </h2>

            <p>
              Cuéntanos qué estás buscando y juntos podemos crear algo especial
              para esa ocasión.
            </p>

            <Link to="/contacto" className="cta-button">
              Hablemos
              <ArrowRight size={18} strokeWidth={1.8} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
