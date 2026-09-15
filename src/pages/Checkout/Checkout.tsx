import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

import PublicFeedback from "../../components/PublicFeedback/PublicFeedback";
import { useAuth } from "../../context/useAuth";
import { useCart } from "../../context/useCart";

import "./Checkout.css";
import { createOrder } from "../../services/orderService";
import { resolveProductImage } from "../../utils/productImage";

interface CheckoutFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  delivery: string;
  notes: string;
}

function Checkout() {
  const { customerToken, customerUser } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    defaultValues: {
      name: customerUser?.name ?? "",
      email: customerUser?.email ?? "",
    },
  });

  const deliveryType = useWatch({
    control,
    name: "delivery",
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError("");

      const order = await createOrder(
        {
          customerName: data.name,
          phone: data.phone,
          email: data.email,
          deliveryType: data.delivery,
          address: data.delivery === "delivery" ? data.address : undefined,
          city: data.delivery === "delivery" ? data.city : undefined,
          notes: data.notes,
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        },
        customerToken,
      );

      setOrderNumber(String(order.id));
      setConfirmedTotal(Number(order.total));
      setOrderConfirmed(true);
      clearCart();
    } catch (error) {
      console.error("Error al crear el pedido:", error);
      setSubmitError("No pudimos crear el pedido. Inténtalo nuevamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="checkout-page">
        <div className="container checkout-success">
          <div className="checkout-success-icon">
            <Check size={30} />
          </div>

          <span className="section-eyebrow">Pedido recibido</span>

          <h1>
            Gracias por
            <span> elegirnos.</span>
          </h1>

          <div className="checkout-order-number">
            <span>Número de pedido</span>
            <strong>#{orderNumber}</strong>
          </div>

          <div className="checkout-confirmed-total">
            <span>Total del pedido</span>
            <strong>${confirmedTotal.toFixed(2)}</strong>
          </div>

          <p>
            Hemos recibido tu pedido correctamente. Pronto nos pondremos en
            contacto contigo para confirmar los detalles de la entrega.
          </p>

          <div className="checkout-success-actions">
            {customerUser && (
              <Link to="/cuenta" className="checkout-success-button">
                Ver mis pedidos
              </Link>
            )}

            <Link to="/catalogo" className="checkout-success-button secondary">
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <PublicFeedback
            type="empty"
            title="No tienes productos para pedir."
            message="Agrega algunas flores a tu carrito antes de continuar."
          >
            <Link to="/catalogo">Explorar catálogo</Link>
          </PublicFeedback>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <Link to="/carrito" className="checkout-back">
          <ArrowLeft size={18} />
          Volver al carrito
        </Link>

        <div className="checkout-header">
          <span className="section-eyebrow">Tu pedido</span>

          <h1>
            Casi estamos
            <span> listos.</span>
          </h1>

          <p>Completa tus datos y nos encargaremos del resto.</p>
        </div>

        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>
            <section className="checkout-section">
              <div className="checkout-section-header">
                <div>
                  <h2>Datos personales</h2>
                  <p>Necesitamos estos datos para contactarte.</p>
                </div>
              </div>

              <div className="checkout-form-row">
                <div className="checkout-field">
                  <label htmlFor="name">Nombre completo</label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Tu nombre"
                    {...register("name", {
                      required: "El nombre es obligatorio",
                      minLength: {
                        value: 3,
                        message: "El nombre debe tener al menos 3 caracteres",
                      },
                    })}
                  />

                  {errors.name && (
                    <span className="checkout-error">
                      {errors.name.message}
                    </span>
                  )}
                </div>

                <div className="checkout-field">
                  <label htmlFor="phone">Teléfono</label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+503 7000-0000"
                    {...register("phone", {
                      required: "El teléfono es obligatorio",
                      pattern: {
                        value: /^[0-9+\-\s]{8,20}$/,
                        message: "Ingresa un teléfono válido",
                      },
                    })}
                  />

                  {errors.phone && (
                    <span className="checkout-error">
                      {errors.phone.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="email">Correo electrónico</label>

                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Ingresa un correo válido",
                    },
                  })}
                />

                {errors.email && (
                  <span className="checkout-error">{errors.email.message}</span>
                )}
              </div>
            </section>

            <section className="checkout-section">
              <div className="checkout-section-header">
                <div>
                  <h2>Entrega</h2>
                  <p>¿Dónde quieres recibir tus flores?</p>
                </div>
              </div>

              <div className="checkout-field">
                <label htmlFor="delivery">Tipo de entrega</label>

                <select
                  id="delivery"
                  defaultValue=""
                  {...register("delivery", {
                    required: "Selecciona una opción de entrega",
                  })}
                >
                  <option value="" disabled>
                    Selecciona una opción
                  </option>

                  <option value="delivery">Envío a domicilio</option>

                  <option value="pickup">Recoger en tienda</option>
                </select>

                {errors.delivery && (
                  <span className="checkout-error">
                    {errors.delivery.message}
                  </span>
                )}
              </div>

              {deliveryType === "delivery" && (
                <>
                  <div className="checkout-field">
                    <label htmlFor="address">Dirección</label>

                    <input
                      id="address"
                      type="text"
                      placeholder="Calle, colonia, número..."
                      {...register("address", {
                        required:
                          deliveryType === "delivery"
                            ? "La dirección es obligatoria"
                            : false,
                        minLength: {
                          value: 5,
                          message: "Ingresa una dirección válida",
                        },
                      })}
                    />

                    {errors.address && (
                      <span className="checkout-error">
                        {errors.address.message}
                      </span>
                    )}
                  </div>

                  <div className="checkout-field">
                    <label htmlFor="city">Ciudad</label>

                    <input
                      id="city"
                      type="text"
                      placeholder="San Salvador"
                      {...register("city", {
                        required:
                          deliveryType === "delivery"
                            ? "La ciudad es obligatoria"
                            : false,
                      })}
                    />

                    {errors.city && (
                      <span className="checkout-error">
                        {errors.city.message}
                      </span>
                    )}
                  </div>
                </>
              )}

              <div className="checkout-field">
                <label htmlFor="notes">Notas del pedido</label>

                <textarea
                  id="notes"
                  rows={4}
                  placeholder="¿Alguna indicación especial?"
                  {...register("notes")}
                />
              </div>
            </section>

            {submitError && (
              <PublicFeedback
                type="error"
                title={submitError}
                message="Revisa tu conexión y vuelve a intentarlo."
              />
            )}

            <button
              type="submit"
              className="checkout-submit"
              disabled={submitting}
            >
              {submitting ? "Confirmando pedido..." : "Confirmar pedido"}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Resumen</h2>

            <div className="checkout-products">
              {cartItems.map((item) => (
                <div className="checkout-product" key={item.product.id}>
                  <img
                    src={resolveProductImage(item.product.image)}
                    alt={item.product.name}
                  />

                  <div className="checkout-product-info">
                    <strong>{item.product.name}</strong>

                    <span>
                      {item.quantity} x ${item.product.price.toFixed(2)}
                    </span>
                  </div>

                  <strong>
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-divider" />

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>

            <div className="checkout-summary-row">
              <span>Envío</span>
              <span>Por calcular</span>
            </div>

            <div className="checkout-summary-total">
              <span>Total</span>

              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
