import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../context/useAuth";
import {
  createProduct,
  getProductById,
  updateProduct,
} from "../../services/productService";
import { getOccasions, type Occasion } from "../../services/occasionService";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminProductForm.css";
import Swal from "sweetalert2";
import { resolveProductImage } from "../../utils/productImage";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedImageTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const DESCRIPTION_MAX_LENGTH = 191;
const PRODUCT_CATEGORIES = ["Ramos", "Arreglos", "Regalos"];

interface ProductFormSnapshot {
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  featured: boolean;
  occasions: string[];
}

const normalizeOccasions = (items: string[]) => [...items].sort().join("|");

function AdminProductForm() {
  const { token } = useAuth();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageError, setImageError] = useState("");
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [availableOccasions, setAvailableOccasions] = useState<Occasion[]>([]);
  const [initialProduct, setInitialProduct] =
    useState<ProductFormSnapshot | null>(null);

  const hasProductChanges =
    !isEditing ||
    !initialProduct ||
    Boolean(imageFile) ||
    name !== initialProduct.name ||
    description !== initialProduct.description ||
    price !== initialProduct.price ||
    image !== initialProduct.image ||
    category !== initialProduct.category ||
    featured !== initialProduct.featured ||
    normalizeOccasions(occasions) !==
      normalizeOccasions(initialProduct.occasions);

  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    const loadOccasions = async () => {
      try {
        const data = await getOccasions();
        setAvailableOccasions(data);
      } catch (error) {
        console.error("Error al cargar ocasiones:", error);
      }
    };

    loadOccasions();
  }, []);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      try {
        const product = await getProductById(Number(id));

        setName(product.name);
        setDescription(product.description);
        setPrice(String(product.price));
        setImage(product.image);
        setImagePreview(resolveProductImage(product.image));
        setCategory(product.category);
        setFeatured(product.featured);
        setOccasions(product.occasion);
        setInitialProduct({
          name: product.name,
          description: product.description,
          price: String(product.price),
          image: product.image,
          category: product.category,
          featured: product.featured,
          occasions: product.occasion,
        });
      } catch (error) {
        console.error("Error al cargar producto:", error);

        await Swal.fire({
          icon: "error",
          title: "No se pudo cargar el producto",
          text: "Ocurrió un error al obtener la información del producto.",
          confirmButtonText: "Aceptar",
        });
      }
    };

    loadProduct();
  }, [id]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setImageError("");

    if (!file) {
      setImageFile(null);
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setImageError("Usa una imagen JPG, PNG, WebP o GIF.");
      setImageFile(null);
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("La imagen no debe superar 5 MB.");
      setImageFile(null);
      event.target.value = "";
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (isEditing && !hasProductChanges) {
      return;
    }

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      (!image.trim() && !imageFile) ||
      !category.trim()
    ) {
      await Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Por favor completa todos los campos obligatorios.",
        confirmButtonText: "Entendido",
      });

      return;
    }

    if (Number(price) <= 0) {
      await Swal.fire({
        icon: "warning",
        title: "Precio inválido",
        text: "El precio debe ser mayor a 0.",
        confirmButtonText: "Entendido",
      });

      return;
    }

    if (!token) {
      return;
    }

    try {
      setLoading(true);

      const data = {
        name,
        description,
        price: Number(price),
        image,
        imageFile,
        category,
        featured,
        occasions,
      };

      if (isEditing && id) {
        await updateProduct(token, Number(id), data);

        await Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          text: "El producto se actualizó correctamente.",
          confirmButtonText: "Aceptar",
        });

        navigate("/admin/productos");
      } else {
        await createProduct(token, data);

        await Swal.fire({
          icon: "success",
          title: "Producto creado",
          text: "El producto se agregó correctamente al catálogo.",
          confirmButtonText: "Aceptar",
        });
      }
      setName("");
      setDescription("");
      setPrice("");
      setImage("");
      setImageFile(null);
      setImagePreview("");
      setImageError("");
      setCategory("");
      setFeatured(false);
      setOccasions([]);
    } catch (error) {
      console.error("Error al crear producto:", error);

      await Swal.fire({
        icon: "error",
        title: isEditing
          ? "No se pudo actualizar el producto"
          : "No se pudo crear el producto",
        text: isEditing
          ? "Ocurrió un error al actualizar el producto. Inténtalo nuevamente."
          : "Ocurrió un error al crear el producto. Inténtalo nuevamente.",
        confirmButtonText: "Entendido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-product-form">
      <h1>{isEditing ? "Editar producto" : "Nuevo producto"}</h1>

      <p className="admin-product-form-subtitle">
        {isEditing
          ? "Actualiza la información del producto."
          : "Agrega un nuevo producto al catálogo de EXPONTANEA SV."}
      </p>

      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Nombre</label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej. Ramo Primavera"
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Precio</label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              placeholder="Ej. 45.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>

          <textarea
            id="description"
            maxLength={DESCRIPTION_MAX_LENGTH}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe el producto..."
          />

          <span className="form-help">
            {DESCRIPTION_MAX_LENGTH - description.length} caracteres
            disponibles
          </span>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="image">Imagen</label>

            <input
              id="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
            />

            <span className="form-help">
              Selecciona una imagen JPG, PNG, WebP o GIF de hasta 5 MB.
            </span>

            {imageError && (
              <span className="form-error">{imageError}</span>
            )}

            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt={name || "Producto"} />
                <span>
                  {imageFile
                    ? imageFile.name
                    : "Imagen actual del producto"}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">Categoría</label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="">Selecciona una categoría</option>
              {PRODUCT_CATEGORIES.map((productCategory) => (
                <option key={productCategory} value={productCategory}>
                  {productCategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-section">
          <span className="form-section-title">Ocasiones</span>

          <div className="occasions-grid">
            {availableOccasions.map((occasion) => (
              <label key={occasion.id} className="occasion-checkbox">
                <input
                  type="checkbox"
                  value={occasion.name}
                  checked={occasions.includes(occasion.name)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setOccasions([...occasions, occasion.name]);
                    } else {
                      setOccasions(
                        occasions.filter((item) => item !== occasion.name),
                      );
                    }
                  }}
                />

                <span>{occasion.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-section">
          <span className="form-section-title">Visibilidad</span>

          <label className="featured-checkbox">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
            />

            <span>Producto destacado</span>
          </label>
        </div>

        <div className="product-form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/admin/productos")}
            disabled={loading}
          >
            Cancelar
          </button>

          {hasProductChanges && (
            <button type="submit" disabled={loading}>
              {loading
                ? isEditing
                  ? "Actualizando producto..."
                  : "Creando producto..."
                : isEditing
                  ? "Actualizar producto"
                  : "Crear producto"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default AdminProductForm;
