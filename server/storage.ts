import {
  users,
  products,
  services,
  orders,
  orderItems,
  cartItems,
  savTickets,
  suggestions,
  promoCodes,
  productCategories,
  serviceCategories,
  type User,
  type UpsertUser,
  type Product,
  type Service,
  type Order,
  type OrderItem,
  type CartItem,
  type SavTicket,
  type Suggestion,
  type PromoCode,
  type ProductCategory,
  type ServiceCategory,
  type InsertProduct,
  type InsertService,
  type InsertOrder,
  type InsertOrderItem,
  type InsertCartItem,
  type InsertSavTicket,
  type InsertSuggestion,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, like, or, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Product operations
  getProducts(filters?: {
    categoryId?: string;
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByIds(ids: string[]): Promise<Product[]>;
  getProductCategories(): Promise<ProductCategory[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;

  // Service operations
  getServices(filters?: {
    categoryId?: string;
    search?: string;
  }): Promise<Service[]>;
  getService(id: string): Promise<Service | undefined>;
  getServicesByIds(ids: string[]): Promise<Service[]>;
  getServiceCategories(): Promise<ServiceCategory[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;

  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem>;
  removeFromCart(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;

  // Order operations
  getOrders(userId?: string): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  updateOrderStatus(id: string, status: string): Promise<Order>;

  // SAV operations
  getSavTickets(userId?: string): Promise<SavTicket[]>;
  getSavTicket(id: string): Promise<SavTicket | undefined>;
  createSavTicket(ticket: InsertSavTicket): Promise<SavTicket>;
  updateSavTicket(id: string, updates: Partial<InsertSavTicket>): Promise<SavTicket>;

  // Suggestion operations
  getSuggestions(): Promise<Suggestion[]>;
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;

  // Promo code operations
  getPromoCode(code: string): Promise<PromoCode | undefined>;
  validatePromoCode(code: string, orderAmount: number): Promise<PromoCode | null>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Product operations
  async getProducts(filters?: {
    categoryId?: string;
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  }): Promise<Product[]> {
    let query = db.select().from(products);

    const conditions = [];
    
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(products.name, `%${filters.search}%`),
          like(products.description, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.brand) {
      conditions.push(eq(products.brand, filters.brand));
    }
    
    if (filters?.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice.toString()));
    }
    
    if (filters?.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice.toString()));
    }
    
    if (filters?.inStock !== undefined) {
      conditions.push(eq(products.inStock, filters.inStock));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    return await db.select().from(products).where(sql`${products.id} = ANY(${ids})`);
  }

  async getProductCategories(): Promise<ProductCategory[]> {
    return await db.select().from(productCategories).orderBy(productCategories.name);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  // Service operations
  async getServices(filters?: {
    categoryId?: string;
    search?: string;
  }): Promise<Service[]> {
    let query = db.select().from(services);

    const conditions = [];
    
    if (filters?.categoryId) {
      conditions.push(eq(services.categoryId, filters.categoryId));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          like(services.name, `%${filters.search}%`),
          like(services.description, `%${filters.search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return await query.orderBy(desc(services.createdAt));
  }

  async getService(id: string): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getServicesByIds(ids: string[]): Promise<Service[]> {
    return await db.select().from(services).where(sql`${services.id} = ANY(${ids})`);
  }

  async getServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories).orderBy(serviceCategories.name);
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existing = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          cartItem.productId ? eq(cartItems.productId, cartItem.productId) : sql`${cartItems.productId} IS NULL`,
          cartItem.serviceId ? eq(cartItems.serviceId, cartItem.serviceId) : sql`${cartItems.serviceId} IS NULL`
        )
      );

    if (existing.length > 0) {
      // Update existing item quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existing[0].quantity + cartItem.quantity })
        .where(eq(cartItems.id, existing[0].id))
        .returning();
      return updatedItem;
    } else {
      // Insert new item
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrders(userId?: string): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId)) as any;
    }
    
    return await query.orderBy(desc(orders.createdAt));
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    // Generate order number
    const orderNumber = `CMD-${Date.now()}`;
    const [newOrder] = await db
      .insert(orders)
      .values({ ...order, orderNumber })
      .returning();
    return newOrder;
  }

  async addOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ status: status as any, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  // SAV operations
  async getSavTickets(userId?: string): Promise<SavTicket[]> {
    let query = db.select().from(savTickets);
    
    if (userId) {
      query = query.where(eq(savTickets.userId, userId)) as any;
    }
    
    return await query.orderBy(desc(savTickets.createdAt));
  }

  async getSavTicket(id: string): Promise<SavTicket | undefined> {
    const [ticket] = await db.select().from(savTickets).where(eq(savTickets.id, id));
    return ticket;
  }

  async createSavTicket(ticket: InsertSavTicket): Promise<SavTicket> {
    // Generate ticket number
    const ticketNumber = `SAV-${Date.now()}`;
    const [newTicket] = await db
      .insert(savTickets)
      .values({ ...ticket, ticketNumber })
      .returning();
    return newTicket;
  }

  async updateSavTicket(id: string, updates: Partial<InsertSavTicket>): Promise<SavTicket> {
    const [updatedTicket] = await db
      .update(savTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(savTickets.id, id))
      .returning();
    return updatedTicket;
  }

  // Suggestion operations
  async getSuggestions(): Promise<Suggestion[]> {
    return await db.select().from(suggestions).orderBy(desc(suggestions.createdAt));
  }

  async createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion> {
    const [newSuggestion] = await db.insert(suggestions).values(suggestion).returning();
    return newSuggestion;
  }

  // Promo code operations
  async getPromoCode(code: string): Promise<PromoCode | undefined> {
    const [promoCode] = await db.select().from(promoCodes).where(eq(promoCodes.code, code));
    return promoCode;
  }

  async validatePromoCode(code: string, orderAmount: number): Promise<PromoCode | null> {
    const [promoCode] = await db
      .select()
      .from(promoCodes)
      .where(
        and(
          eq(promoCodes.code, code),
          eq(promoCodes.isActive, true),
          lte(promoCodes.validFrom, new Date()),
          gte(promoCodes.validUntil, new Date()),
          or(
            sql`${promoCodes.minOrderAmount} IS NULL`,
            lte(promoCodes.minOrderAmount, orderAmount.toString())
          ),
          or(
            sql`${promoCodes.usageLimit} IS NULL`,
            sql`${promoCodes.usageCount} < ${promoCodes.usageLimit}`
          )
        )
      );

    return promoCode || null;
  }
}

export const storage = new DatabaseStorage();
