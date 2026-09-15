import { prisma } from "../config/prisma";

export const getProducts = async (occasion?: string) => {
  const products = await prisma.product.findMany({
    where: occasion
      ? {
          productoccasion: {
            some: {
              occasion: {
                name: occasion,
              },
            },
          },
        }
      : undefined,
    orderBy: {
      id: "asc",
    },
    include: {
      productoccasion: {
        include: {
          occasion: true,
        },
      },
    },
  });

  return products.map((product) => {
    const { productoccasion, ...productData } = product;

    return {
      ...productData,
      price: Number(product.price),
      occasion: productoccasion.map(
        (productOccasion) => productOccasion.occasion.name
      ),
    };
  });
};

export const getProductById = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
    include: {
      productoccasion: {
        include: {
          occasion: true,
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const { productoccasion, ...productData } = product;

  return {
    ...productData,
    price: Number(product.price),
    occasion: productoccasion.map(
      (productOccasion) => productOccasion.occasion.name
    ),
  };
};

interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  occasions?: string[];
}

export const createProduct = async (
  data: CreateProductData
) => {
  if (!data.name?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!data.description?.trim()) {
    throw new Error("La descripción es obligatoria");
  }

  if (!Number.isFinite(data.price) || data.price <= 0) {
    throw new Error("El precio debe ser mayor a 0");
  }

  if (!data.image?.trim()) {
    throw new Error("La imagen es obligatoria");
  }

  if (!data.category?.trim()) {
    throw new Error("La categoría es obligatoria");
  }

  const occasionNames = data.occasions ?? [];

  const occasions = await prisma.occasion.findMany({
    where: {
      name: {
        in: occasionNames,
      },
    },
  });

  if (occasions.length !== occasionNames.length) {
    throw new Error("Una o más ocasiones no existen");
  }

  const product = await prisma.product.create({
    data: {
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price,
      image: data.image.trim(),
      category: data.category.trim(),
      featured: data.featured ?? false,
      updatedAt: new Date(),

      productoccasion: {
        create: occasions.map((occasion) => ({
          occasionId: occasion.id,
        })),
      },
    },

    include: {
      productoccasion: {
        include: {
          occasion: true,
        },
      },
    },
  });

  return {
    ...product,
    price: Number(product.price),
    occasion: product.productoccasion.map(
      (productOccasion) => productOccasion.occasion.name
    ),
  };
};

export const deleteProduct = async (id: number) => {
  const product = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  if (!product) {
    throw new Error("El producto no existe");
  }

  await prisma.product.delete({
    where: {
      id,
    },
  });
};

interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  occasions?: string[];
}

export const updateProduct = async (
  id: number,
  data: UpdateProductData
) => {
  if (!data.name?.trim()) {
    throw new Error("El nombre es obligatorio");
  }

  if (!data.description?.trim()) {
    throw new Error("La descripción es obligatoria");
  }

  if (!Number.isFinite(data.price) || data.price <= 0) {
    throw new Error("El precio debe ser mayor a 0");
  }

  if (!data.image?.trim()) {
    throw new Error("La imagen es obligatoria");
  }

  if (!data.category?.trim()) {
    throw new Error("La categoría es obligatoria");
  }

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("El producto no existe");
  }

  const occasionNames = data.occasions ?? [];

const occasions = await prisma.occasion.findMany({
  where: {
    name: {
      in: occasionNames,
    },
  },
});

if (occasions.length !== occasionNames.length) {
  throw new Error("Una o más ocasiones no existen");
}

await prisma.productoccasion.deleteMany({
  where: {
    productId: id,
  },
});

if (occasions.length > 0) {
  await prisma.productoccasion.createMany({
    data: occasions.map((occasion) => ({
      productId: id,
      occasionId: occasion.id,
    })),
  });
}

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name: data.name.trim(),
      description: data.description.trim(),
      price: data.price,
      image: data.image.trim(),
      category: data.category.trim(),
      featured: data.featured ?? false,
    },
  });

  return {
  ...updatedProduct,
  price: Number(updatedProduct.price),
  occasion: occasions.map((occasion) => occasion.name),
};
};
