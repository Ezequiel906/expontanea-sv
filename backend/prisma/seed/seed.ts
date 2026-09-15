import "dotenv/config";
import process from "node:process";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import bcrypt from "bcrypt";


const adapter = new PrismaMariaDb(process.env.DATABASE_URL!);
const prisma = new PrismaClient({ adapter });

const products = [
  {
    name: "Ramo Aurora",
    description: "Un hermoso ramo de flores frescas en tonos suaves.",
    price: 35,
    image: "/src/assets/images/products/ramo-aurora.jpg",
    category: "Ramos",
    featured: true,
    occasions: ["cumpleanos", "dia-madre", "porque-si"],
  },
  {
    name: "Jardín Rosado",
    description: "Un arreglo floral elegante en tonos rosados.",
    price: 42,
    image: "/src/assets/images/products/jardin-rosado.jpg",
    category: "Arreglos",
    featured: true,
    occasions: ["cumpleanos", "san-valentin", "dia-madre"],
  },
  {
    name: "Detalle Primavera",
    description: "Un pequeño detalle para alegrar cualquier día.",
    price: 28,
    image: "/src/assets/images/products/detalle-primavera.jpg",
    category: "Regalos",
    featured: true,
    occasions: ["cumpleanos", "porque-si"],
  },
  {
    name: "Ramo Silvestre",
    description:
      "Un ramo natural inspirado en la belleza de las flores silvestres.",
    price: 38,
    image: "/src/assets/images/products/ramo-silvestre.jpg",
    category: "Ramos",
    featured: true,
    occasions: ["bodas", "cumpleanos", "condolencias"],
  },
];

const occasions = [
  {
    name: "cumpleanos",
  },
  {
    name: "bodas",
  },
  {
    name: "san-valentin",
  },
  {
    name: "condolencias",
  },
  {
    name: "dia-madre",
  },
  {
    name: "porque-si",
  },
];

async function main() {
  // Crear administrador
  const adminPassword = await bcrypt.hash("Admin1234", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@expontanea.com",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "Administrador",
      email: "admin@expontanea.com",
      password: adminPassword,
      role: "ADMIN",
      updatedAt: new Date(),
    },
  });

  console.log("👑 Administrador creado correctamente");
  // Crear ocasiones
  for (const occasion of occasions) {
    await prisma.occasion.upsert({
      where: {
        name: occasion.name,
      },
      update: {},
      create: occasion,
    });
  }

  // Crear o actualizar productos
  for (const product of products) {
    const { occasions: productOccasions, ...productData } = product;

    const savedProduct = await prisma.product.upsert({
  where: {
    id: products.indexOf(product) + 1,
  },
  update: {
    ...productData,
    updatedAt: new Date(),
  },
  create: {
    ...productData,
    updatedAt: new Date(),
  },
});

    // Crear relaciones producto → ocasión
    for (const occasionName of productOccasions) {
      const occasion = await prisma.occasion.findUnique({
        where: {
          name: occasionName,
        },
      });

      if (!occasion) {
        throw new Error(`Ocasión no encontrada: ${occasionName}`);
      }

      await prisma.productoccasion.upsert({
        where: {
          productId_occasionId: {
            productId: savedProduct.id,
            occasionId: occasion.id,
          },
        },
        update: {},
        create: {
          productId: savedProduct.id,
          occasionId: occasion.id,
        },
      });
    }
  }

  console.log("🌸 Productos y ocasiones creados correctamente");
}

main()
  .catch((error) => {
    console.error("❌ Error al ejecutar el seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });