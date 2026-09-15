import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Ocassions.css";

import cumpleanos from "../../assets/images/ocassions/cumpleanos.jpg";
import bodas from "../../assets/images/ocassions/bodas.jpg";
import sanValentin from "../../assets/images/ocassions/san-valentin.jpg";
import condolencias from "../../assets/images/ocassions/condolencias.jpg";

const occasions = [
  {
    name: "Cumpleaños",
    image: cumpleanos,
    slug: "cumpleanos",
  },
  {
    name: "Bodas",
    image: bodas,
    slug: "bodas",
  },
  {
    name: "San Valentín",
    image: sanValentin,
    slug: "san-valentin",
  },
  {
    name: "Condolencias",
    image: condolencias,
    slug: "condolencias",
  },
];

function Occasions() {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    occasions.forEach((occasion) => {
      const image = new Image();

      image.src = occasion.image;

      if (image.complete) {
        setLoadedImages((currentLoadedImages) => ({
          ...currentLoadedImages,
          [occasion.slug]: true,
        }));
        return;
      }

      image.onload = () => {
        setLoadedImages((currentLoadedImages) => ({
          ...currentLoadedImages,
          [occasion.slug]: true,
        }));
      };
    });
  }, []);

  return (
    <section className="occasions-section">
      <div className="container">
        <div className="occasions-header">
          <div>
            <span className="section-eyebrow">Encuentra el momento</span>

            <h2>
              Flores para cada <span>ocasión.</span>
            </h2>
          </div>

          <p>
            Diseños pensados para acompañar cada momento importante de tu vida.
          </p>
        </div>

        <div className="occasions-grid">
          {occasions.map((occasion) => (
            <Link
              to={`/catalogo?ocasion=${occasion.slug}`}
              className={`occasion-card ${
                loadedImages[occasion.slug] ? "is-loaded" : ""
              }`}
              key={occasion.slug}
            >
              <img
                src={occasion.image}
                alt={occasion.name}
                decoding="async"
                onLoad={() =>
                  setLoadedImages((currentLoadedImages) => ({
                    ...currentLoadedImages,
                    [occasion.slug]: true,
                  }))
                }
              />

              <div className="occasion-overlay">
                <h3>{occasion.name}</h3>
                <span>Ver arreglos →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Occasions;
