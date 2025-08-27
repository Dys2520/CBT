import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  integer,
  decimal,
  timestamp,
  boolean,
  jsonb,
  index,
  pgEnum
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const productCategories = pgTable("product_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  specs: text("specs"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  categoryId: varchar("category_id").references(() => productCategories.id),
  brand: varchar("brand", { length: 255 }),
  inStock: boolean("in_stock").default(true),
  isHot: boolean("is_hot").default(false),
  isNew: boolean("is_new").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceCategories = pgTable("service_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  imageUrl: varchar("image_url"),
  categoryId: varchar("category_id").references(() => serviceCategories.id),
  isNew: boolean("is_new").default(false),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed", 
  "processing",
  "shipped",
  "delivered",
  "cancelled"
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "check",
  "cash"
]);

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  status: orderStatusEnum("status").default("pending"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 12, scale: 2 }).default("0"),
  total: decimal("total", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  shippingAddress: jsonb("shipping_address").notNull(),
  promoCode: varchar("promo_code", { length: 50 }),
  discount: decimal("discount", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  productId: varchar("product_id").references(() => products.id),
  serviceId: varchar("service_id").references(() => services.id),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  productId: varchar("product_id").references(() => products.id),
  serviceId: varchar("service_id").references(() => services.id),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savTicketStatusEnum = pgEnum("sav_ticket_status", [
  "pending",
  "in_progress", 
  "resolved",
  "closed"
]);

export const savTicketTypeEnum = pgEnum("sav_ticket_type", [
  "defective_product",
  "damaged_delivery",
  "wrong_product",
  "change_of_mind",
  "other"
]);

export const savTickets = pgTable("sav_tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ticketNumber: varchar("ticket_number", { length: 50 }).notNull().unique(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  orderId: varchar("order_id").references(() => orders.id).notNull(),
  orderItemId: varchar("order_item_id").references(() => orderItems.id).notNull(),
  type: savTicketTypeEnum("type").notNull(),
  status: savTicketStatusEnum("status").default("pending"),
  description: text("description").notNull(),
  resolution: text("resolution"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suggestionCategoryEnum = pgEnum("suggestion_category", [
  "products",
  "services", 
  "website",
  "delivery",
  "sav",
  "other"
]);

export const suggestions = pgTable("suggestions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  category: suggestionCategoryEnum("category").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promoCodes = pgTable("promo_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  code: varchar("code", { length: 50 }).notNull().unique(),
  description: text("description"),
  discountPercent: decimal("discount_percent", { precision: 5, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }),
  minOrderAmount: decimal("min_order_amount", { precision: 12, scale: 2 }),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until").notNull(),
  isActive: boolean("is_active").default(true),
  usageLimit: integer("usage_limit"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  cartItems: many(cartItems),
  savTickets: many(savTickets),
}));

export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one, many }) => ({
  category: one(serviceCategories, {
    fields: [services.categoryId],
    references: [serviceCategories.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
  savTickets: many(savTickets),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  service: one(services, {
    fields: [orderItems.serviceId],
    references: [services.id],
  }),
  savTickets: many(savTickets),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  user: one(users, {
    fields: [cartItems.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
  service: one(services, {
    fields: [cartItems.serviceId],
    references: [services.id],
  }),
}));

export const savTicketsRelations = relations(savTickets, ({ one }) => ({
  user: one(users, {
    fields: [savTickets.userId],
    references: [users.id],
  }),
  order: one(orders, {
    fields: [savTickets.orderId],
    references: [orders.id],
  }),
  orderItem: one(orderItems, {
    fields: [savTickets.orderItemId],
    references: [orderItems.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;

export type InsertService = typeof services.$inferInsert;
export type Service = typeof services.$inferSelect;

export type InsertOrder = typeof orders.$inferInsert;
export type Order = typeof orders.$inferSelect;

export type InsertOrderItem = typeof orderItems.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;

export type InsertCartItem = typeof cartItems.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;

export type InsertSavTicket = typeof savTickets.$inferInsert;
export type SavTicket = typeof savTickets.$inferSelect;

export type InsertSuggestion = typeof suggestions.$inferInsert;
export type Suggestion = typeof suggestions.$inferSelect;

export type InsertPromoCode = typeof promoCodes.$inferInsert;
export type PromoCode = typeof promoCodes.$inferSelect;

export type ProductCategory = typeof productCategories.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;

// Zod schemas
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
});

export const insertSavTicketSchema = createInsertSchema(savTickets).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSuggestionSchema = createInsertSchema(suggestions).omit({
  id: true,
  createdAt: true,
});
