import type { Express, RequestHandler } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Configuration de session locale utilisant votre PostgreSQL existant
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  
  // Utilise votre base PostgreSQL locale existante
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true, // Créera la table sessions si nécessaire
    ttl: sessionTtl,
    tableName: "sessions", // Même table que dans le schéma existant
  });

  return session({
    secret: process.env.SESSION_SECRET || "cbt_local_secret_123",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // false pour local
      maxAge: sessionTtl,
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  console.log("🔓 Mode local CBT : authentification locale active");
  console.log("📊 Utilise la base PostgreSQL locale existante");
}

// Middleware d'authentification locale - simule un admin connecté
export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // En mode local, on simule un utilisateur admin connecté
  (req as any).user = {
    claims: {
      sub: "local_admin_cbt",
      email: "admin@cbt.local",
      first_name: "Admin",
      last_name: "CBT"
    }
  };
  
  // Toujours autoriser en mode local
  next();
};

// Route de login locale simple
export function setupLocalAuthRoutes(app: Express) {
  app.get("/api/login", (req, res) => {
    res.redirect("/admin");
  });
  
  app.get("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      res.redirect("/");
    });
  });
}