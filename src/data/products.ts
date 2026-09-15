import type { Product } from "../types/product";

import ramoAurora from "../assets/images/products/Regalo4.jpg";
import jardinRosado from "../assets/images/products/valentin4.jpg";
import detallePrimavera from "../assets/images/products/arreglo4.jpg";
import ramoSilvestre from "../assets/images/products/boda2.jpg";

export const products: Product[] = [
  {
    id: 22,
    name: "Arreglo con peluche y globo",
    description: "Un regalo especial para celebrar ese día tan importante.",
    price: 35,
    image: ramoAurora,
    category: "Ramos",
    featured: true,
    occasion: ["cumpleanos", "aniversarios"],
  },
  {
    id: 15,
    name: "Ramo rojo romántico",
    description: "Una mezcla romántica de rosas rojas.",
    price: 42,
    image: jardinRosado,
    category: "Arreglos",
    featured: true,
    occasion: ["cumpleanos", "dia-madre", "aniversarios"],
  },
  {
    id: 36,
    name: "Fiesta de Color",
    description: "Un pequeño detalle para alegrar cualquier día.",
    price: 28,
    image: detallePrimavera,
    category: "Regalos",
    featured: true,
    occasion: ["cumpleanos", "dia-madre", "porque-si"],
  },
  {
    id: 32,
    name: "Idilio de Seda",
    description: "Flores blancas para bodas y ocasiones especiales.",
    price: 38,
    image: ramoSilvestre,
    category: "Ramos",
    featured: true,
    occasion: ["cumpleanos", "dia-padre", "porque-si"],
  }
];