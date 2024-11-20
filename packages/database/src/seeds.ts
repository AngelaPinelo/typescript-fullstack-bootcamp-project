import { PrismaClient } from '../prisma/prisma-client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];

async function main() {
  // Crear nombres únicos para las colecciones
  const uniqueCollectionNames = Array.from({ length: 5 }).map(
    (_, i) => `${faker.commerce.department()}-${i}`
  );

  const collections = await Promise.all(
    uniqueCollectionNames.map((name) =>
      prisma.collection.create({
        data: {
          name,
          description: faker.lorem.sentence(),
        },
      })
    )
  );

  // Crear nombres únicos para los productos
  const uniqueProductNames = Array.from({ length: 10 }).map(
    (_, i) => `${faker.commerce.productName()}-${i}`
  );

  const products = await Promise.all(
    uniqueProductNames.map((name) =>
      prisma.product.create({
        data: {
          name,
          description: faker.lorem.paragraph(),
          image: faker.image.url(),
          collections: {
            connect: collections.map((collection) => ({
              id: collection.id,
            })),
          },
        },
      })
    )
  );

  // Crear 5 opciones
  const options = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.option.create({
        data: {
          productId: faker.helpers.arrayElement(products).id,
          name: faker.commerce.productMaterial(),
        },
      })
    )
  );

  // Crear 15 valores de opción
  const optionValues = await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.optionValue.create({
        data: {
          optionId: faker.helpers.arrayElement(options).id,
          value: faker.helpers.arrayElement(colors),
        },
      })
    )
  );

  // Crear 20 variantes
  const variants = await Promise.all(
    Array.from({ length: 20 }).map(() =>
      prisma.variant.create({
        data: {
          productId: faker.helpers.arrayElement(products).id,
          name: `${faker.commerce.productAdjective()}-${faker.datatype.uuid()}`,
          description: faker.lorem.sentence(),
          image: faker.image.url(),
          sku: faker.string.alphanumeric(10),
          price: faker.number.int({ min: 1000, max: 10000 }),
          stock: faker.number.int({ min: 1, max: 100 }),
        },
      })
    )
  );

  console.log('Datos creados con éxito:');
  console.log({
    collections: collections.length,
    products: products.length,
    options: options.length,
    optionValues: optionValues.length,
    variants: variants.length,
  });
}

main()
  .catch((e) => {
   throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
