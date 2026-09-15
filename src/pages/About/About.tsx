import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import "./About.css";

function About() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="container about-hero-content">
          <span className="section-eyebrow">Nuestra esencia</span>

          <h1>
            Flores que hablan
            <span> por ti.</span>
          </h1>

          <p>
            En EXPONTANEA SV creemos que las flores no solo decoran. Acompañan
            momentos, expresan emociones y cuentan historias.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="container about-story-grid">
          <div className="about-story-image">
            <img
              src="https://i.pinimg.com/736x/f4/ef/4c/f4ef4cadf378381dcce6306db829dea6.jpg"
              alt="Flores frescas"
            />
          </div>

          <div className="about-story-content">
            <span className="section-eyebrow">Quiénes somos</span>

            <h2>
              Hecho con intención,
              <span> pensado para sentir.</span>
            </h2>

            <p>
              EXPONTANEA SV nace de una idea sencilla: crear arreglos florales
              que se sientan naturales, elegantes y especiales.
            </p>

            <p>
              Seleccionamos cada flor y diseñamos cada composición pensando en
              la persona que la recibirá.
            </p>

            <Link to="/catalogo" className="about-button">
              Ver nuestros arreglos
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="about-values-header">
            <span className="section-eyebrow">Lo que nos define</span>

            <h2>
              Simplemente
              <span> especial.</span>
            </h2>
          </div>

          <div className="about-values-grid">
            <article className="about-value">
              <span>01</span>
              <h3>Flores frescas</h3>
              <p>Seleccionamos flores cuidadosamente para cada composición.</p>
            </article>

            <article className="about-value">
              <span>02</span>
              <h3>Diseño natural</h3>
              <p>
                Creamos arreglos elegantes que mantienen la belleza natural de
                cada flor.
              </p>
            </article>

            <article className="about-value">
              <span>03</span>
              <h3>Hecho para ti</h3>
              <p>Cada pedido tiene un propósito y una historia detrás.</p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
