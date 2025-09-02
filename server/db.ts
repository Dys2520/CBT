import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL manquante !");
  console.error("Créez un fichier .env avec :");
  console.error("DATABASE_URL=postgresql://postgres:admin123@localhost:5432/cbt_database");
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

console.log("🔌 Connexion à la base PostgreSQL locale :", 
  process.env.DATABASE_URL?.replace(/:[^:]*@/, ':***@')); // Cache le mot de passe

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });