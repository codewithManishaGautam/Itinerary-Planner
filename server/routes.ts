import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, generateItinerarySchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";

const SessionStore = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: false,
      store: new SessionStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        maxAge: 86400000, // 24 hours
        secure: app.get("env") === "production",
      },
    })
  );

  // Authentication Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Auth Routes
  app.post("/api/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(data);
      req.session.userId = user.id;
      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.userId = user.id;
    res.json({ id: user.id, name: user.name, email: user.email });
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/user", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email });
  });

  // Itinerary Route (Mock AI)
  app.post("/api/generate-itinerary", requireAuth, async (req, res) => {
    try {
      const data = generateItinerarySchema.parse(req.body);
      
      // Mock AI Logic
      const itinerary = {
        destination: data.destination,
        duration: `${data.startDate} to ${data.endDate}`,
        budget: data.budget,
        travellers: data.travellers,
        plan: [
          {
            day: 1,
            title: "Arrival & Exploration",
            activities: [
              `Arrive at ${data.destination} Airport`,
              `Check-in to Hotel Sunshine`,
              `Evening walk at City Center`
            ]
          },
          {
            day: 2,
            title: "City Tour",
            activities: [
              `Visit the Grand Museum`,
              `Lunch at local famous spot`,
              `Sunset view at the hilltop`
            ]
          },
          {
            day: 3,
            title: "Adventure & Departure",
            activities: [
              `Morning hike or beach visit`,
              `Shopping for souvenirs`,
              `Departure`
            ]
          }
        ],
        hotels: [
          { name: "Hotel Sunshine", rating: "4.5 stars", price: "$120/night", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500" },
          { name: "City View Inn", rating: "4.0 stars", price: "$90/night", image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500" }
        ],
        flights: [
          { airline: "AirTravel", price: "$300", duration: "4h" },
          { airline: "SkyHigh", price: "$280", duration: "5h" }
        ]
      };

      res.json(itinerary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  return httpServer;
}
