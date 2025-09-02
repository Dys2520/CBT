// API Handler pour Vercel - CBT Application
import express from 'express';
import cors from 'cors';
import { storage } from '../server/storage.js';
import { setupAuth, isAuthenticated, setupLocalAuthRoutes } from '../server/localAuth.js';
import { z } from 'zod';
import {
  insertCartItemSchema,
} from '../shared/schema.js';

const app = express();

// Middleware CORS pour Vercel
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://*.vercel.app'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.set('trust proxy', 1);

// Auth setup
await setupAuth(app);
setupLocalAuthRoutes(app);

// Auth routes
app.get('/api/auth/user', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const { categoryId, search, brand, minPrice, maxPrice, inStock } = req.query;
    const filters = {
      categoryId, search, brand,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      inStock: inStock === 'true' ? true : inStock === 'false' ? false : undefined,
    };
    const products = await storage.getProducts(filters);
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await storage.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// Services routes
app.get('/api/services', async (req, res) => {
  try {
    const { categoryId, search } = req.query;
    const services = await storage.getServices({ categoryId, search });
    res.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch services" });
  }
});

// Cart routes
app.get('/api/cart', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const cartItems = await storage.getCartItems(userId);
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
});

app.post('/api/cart', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const validatedData = insertCartItemSchema.parse({ ...req.body, userId });
    const cartItem = await storage.addToCart(validatedData);
    res.status(201).json(cartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
    }
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
});

// Orders routes
app.get('/api/orders', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.claims.sub;
    const orders = await storage.getOrders(userId);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CBT API running on Vercel!' });
});

export default app;