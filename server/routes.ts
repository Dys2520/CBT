import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";
import {
  insertProductSchema,
  insertServiceSchema,
  insertOrderSchema,
  insertCartItemSchema,
  insertSavTicketSchema,
  insertSuggestionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const {
        categoryId,
        search,
        brand,
        minPrice,
        maxPrice,
        inStock
      } = req.query;

      const filters = {
        categoryId: categoryId as string,
        search: search as string,
        brand: brand as string,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
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
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.get('/api/product-categories', async (req, res) => {
    try {
      const categories = await storage.getProductCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching product categories:", error);
      res.status(500).json({ message: "Failed to fetch product categories" });
    }
  });

  // Service routes
  app.get('/api/services', async (req, res) => {
    try {
      const { categoryId, search } = req.query;
      const filters = {
        categoryId: categoryId as string,
        search: search as string,
      };
      const services = await storage.getServices(filters);
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.get('/api/services/:id', async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      console.error("Error fetching service:", error);
      res.status(500).json({ message: "Failed to fetch service" });
    }
  });

  app.get('/api/service-categories', async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching service categories:", error);
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  // Cart routes
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      
      // Get product and service details for cart items
      const productIds = cartItems.filter(item => item.productId).map(item => item.productId!);
      const serviceIds = cartItems.filter(item => item.serviceId).map(item => item.serviceId!);
      
      const products = productIds.length > 0 ? await storage.getProductsByIds(productIds) : [];
      const services = serviceIds.length > 0 ? await storage.getServicesByIds(serviceIds) : [];
      
      const cartWithDetails = cartItems.map(item => ({
        ...item,
        product: item.productId ? products.find(p => p.id === item.productId) : null,
        service: item.serviceId ? services.find(s => s.id === item.serviceId) : null,
      }));
      
      res.json(cartWithDetails);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItemData = insertCartItemSchema.parse({
        ...req.body,
        userId,
      });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { quantity } = req.body;
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
      
      const cartItem = await storage.updateCartItem(req.params.id, quantity);
      res.json(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.removeFromCart(req.params.id);
      res.json({ message: "Item removed from cart" });
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.json({ message: "Cart cleared" });
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Order routes
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orders = await storage.getOrders(userId);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(order.id);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({
        ...req.body,
        userId,
      });
      
      const order = await storage.createOrder(orderData);
      
      // Add order items from cart
      const cartItems = await storage.getCartItems(userId);
      const productIds = cartItems.filter(item => item.productId).map(item => item.productId!);
      const serviceIds = cartItems.filter(item => item.serviceId).map(item => item.serviceId!);
      
      const products = productIds.length > 0 ? await storage.getProductsByIds(productIds) : [];
      const services = serviceIds.length > 0 ? await storage.getServicesByIds(serviceIds) : [];
      
      for (const cartItem of cartItems) {
        const product = cartItem.productId ? products.find(p => p.id === cartItem.productId) : null;
        const service = cartItem.serviceId ? services.find(s => s.id === cartItem.serviceId) : null;
        
        const unitPrice = product ? parseFloat(product.price) : service ? parseFloat(service.price) : 0;
        const totalPrice = unitPrice * cartItem.quantity;
        
        await storage.addOrderItem({
          orderId: order.id,
          productId: cartItem.productId,
          serviceId: cartItem.serviceId,
          quantity: cartItem.quantity,
          unitPrice: unitPrice.toString(),
          totalPrice: totalPrice.toString(),
        });
      }
      
      // Clear cart after order creation
      await storage.clearCart(userId);
      
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid order data", errors: error.errors });
      }
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  // SAV routes
  app.get('/api/sav-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const tickets = await storage.getSavTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching SAV tickets:", error);
      res.status(500).json({ message: "Failed to fetch SAV tickets" });
    }
  });

  app.post('/api/sav-tickets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const ticketData = insertSavTicketSchema.parse({
        ...req.body,
        userId,
      });
      
      const ticket = await storage.createSavTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid ticket data", errors: error.errors });
      }
      console.error("Error creating SAV ticket:", error);
      res.status(500).json({ message: "Failed to create SAV ticket" });
    }
  });

  // Suggestion routes
  app.post('/api/suggestions', async (req, res) => {
    try {
      const suggestionData = insertSuggestionSchema.parse(req.body);
      const suggestion = await storage.createSuggestion(suggestionData);
      res.json(suggestion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid suggestion data", errors: error.errors });
      }
      console.error("Error creating suggestion:", error);
      res.status(500).json({ message: "Failed to create suggestion" });
    }
  });

  // Promo code routes
  app.post('/api/validate-promo', async (req, res) => {
    try {
      const { code, orderAmount } = req.body;
      
      if (!code || !orderAmount) {
        return res.status(400).json({ message: "Code and order amount are required" });
      }
      
      const promoCode = await storage.validatePromoCode(code, orderAmount);
      
      if (!promoCode) {
        return res.status(404).json({ message: "Invalid or expired promo code" });
      }
      
      res.json(promoCode);
    } catch (error) {
      console.error("Error validating promo code:", error);
      res.status(500).json({ message: "Failed to validate promo code" });
    }
  });

  // Admin routes (protected)
  app.get('/api/admin/orders', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      console.error("Error fetching all orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/admin/sav-tickets', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const tickets = await storage.getSavTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching all SAV tickets:", error);
      res.status(500).json({ message: "Failed to fetch SAV tickets" });
    }
  });

  app.get('/api/admin/suggestions', isAuthenticated, async (req: any, res) => {
    try {
      // TODO: Add admin role check
      const suggestions = await storage.getSuggestions();
      res.json(suggestions);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
