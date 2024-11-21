import bodyParser from 'body-parser'
import express from 'express'
import cors from 'cors'
import { Prisma, PrismaClient } from '@repo/db'

const client = new PrismaClient();

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

app.get('/', async (_, res) => {
  const result = await client.product.findMany({
    include: {
      variants: true
    }
  })
  return res.json({ result })
})

app.get('/products', async (_, res) => {
  try {
    const products = await client.product.findMany({
      include: {
        variants: true,
        options: true,
        collections: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


// Obtener todos los productos
app.get('/products', async (_, res) => {
  try {
    const products = await client.product.findMany({
      include: {
        variants: true,
        options: true,
        collections: true,
      },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Crear un producto
app.post('/products', async (req, res) => {
  const { name, description, image } = req.body;
  try {
    const product = await client.product.create({
      data: { name, description, image },
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Obtener un producto por ID
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await client.product.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        variants: true,
        options: true,
        collections: true,
      },
    });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Actualizar un producto
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  try {
    const updatedProduct = await client.product.update({
      where: { id: parseInt(id, 10) },
      data: { name, description, image },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Eliminar un producto
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await client.product.delete({ where: { id: parseInt(id, 10) } });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});


const port = process.env.PORT || 5001

app.listen(port, () => {
  console.log(`Server API running on http://localhost:${port}`)
})
