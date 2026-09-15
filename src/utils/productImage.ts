import ramoAurora from "../assets/images/products/ramo-aurora.jpg";
import jardinRosado from "../assets/images/products/jardin-rosado.jpg";
import detallePrimavera from "../assets/images/products/detalle-primavera.jpg";
import ramoSilvestre from "../assets/images/products/ramo-silvestre.jpg";
import elegancia from "../assets/images/products/elegancia.jpg";
import amorEterno from "../assets/images/products/amor-eterno.jpg";

const localProductImages: Record<string, string> = {
  "/src/assets/images/products/ramo-aurora.jpg": ramoAurora,
  "/src/assets/images/products/jardin-rosado.jpg": jardinRosado,
  "/src/assets/images/products/detalle-primavera.jpg": detallePrimavera,
  "/src/assets/images/products/ramo-silvestre.jpg": ramoSilvestre,
  "/src/assets/images/products/elegancia.jpg": elegancia,
  "/src/assets/images/products/amor-eterno.jpg": amorEterno,
};

export const resolveProductImage = (image: string) =>
  localProductImages[image] ?? image;
