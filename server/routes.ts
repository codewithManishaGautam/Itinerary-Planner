import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, generateItinerarySchema } from "@shared/schema";
import { z } from "zod";

// Simple token storage (in production, use JWT)
const tokens: Map<string, number> = new Map();

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Authentication Middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    
    const token = authHeader.split(' ')[1];
    const userId = tokens.get(token);
    
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    
    req.userId = userId;
    next();
  };

  // Signup Route
  app.post("/api/signup", async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(data.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(data);
      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  // Login Route
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await storage.getUserByEmail(email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token and store it
    const token = generateToken();
    tokens.set(token, user.id);

    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email,
      token: token
    });
  });

  // Logout Route
  app.post("/api/logout", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      tokens.delete(token);
    }
    res.json({ message: "Logged out" });
  });

  // Get Current User Route
  app.get("/api/user", requireAuth, async (req: any, res) => {
    const user = await storage.getUser(req.userId);
    if (!user) return res.status(401).json({ message: "User not found" });
    res.json({ id: user.id, name: user.name, email: user.email });
  });

  // Generate Itinerary Route (Protected)
  app.post("/api/generate-itinerary", requireAuth, async (req, res) => {
    try {
      const data = generateItinerarySchema.parse(req.body);
      
      // Mock AI Logic - generates realistic itinerary
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      
      const destinationData: Record<string, any> = {
        "paris": {
          places: ["Eiffel Tower", "Louvre Museum", "Notre-Dame Cathedral", "Champs-Élysées", "Montmartre"],
          lat: 48.8566,
          lon: 2.3522
        },
        "tokyo": {
          places: ["Tokyo Tower", "Shibuya Crossing", "Senso-ji Temple", "Meiji Shrine", "Akihabara"],
          lat: 35.6762,
          lon: 139.6503
        },
        "new york": {
          places: ["Statue of Liberty", "Central Park", "Times Square", "Empire State Building", "Brooklyn Bridge"],
          lat: 40.7128,
          lon: -74.0060
        },
        "london": {
          places: ["Big Ben", "Tower of London", "Buckingham Palace", "London Eye", "British Museum"],
          lat: 51.5074,
          lon: -0.1278
        },
        "dubai": {
          places: ["Burj Khalifa", "Dubai Mall", "Palm Jumeirah", "Dubai Marina", "Gold Souk"],
          lat: 25.2048,
          lon: 55.2708
        },
        "goa": {
          places: ["Baga Beach", "Calangute Beach", "Fort Aguada", "Basilica of Bom Jesus", "Dudhsagar Falls"],
          lat: 15.2993,
          lon: 74.1240
        },
        "manali": {
          places: ["Solang Valley", "Rohtang Pass", "Hadimba Temple", "Old Manali", "Manu Temple"],
          lat: 32.2396,
          lon: 77.1887
        }
      };
      
      const destKey = data.destination.toLowerCase();
      const destInfo = destinationData[destKey] || {
        places: ["City Center", "Local Museum", "Main Park", "Historic District", "Market Area"],
        lat: 48.8566,
        lon: 2.3522
      };
      
      // Generate day-wise plan
      const plan = [];
      for (let i = 0; i < Math.min(days, 5); i++) {
        const dayPlaces = destInfo.places.slice(i, i + 2);
        if (dayPlaces.length === 0) {
          dayPlaces.push(destInfo.places[i % destInfo.places.length]);
        }
        plan.push({
          day: i + 1,
          title: i === 0 ? "Arrival & Exploration" : i === days - 1 ? "Departure Day" : `Day ${i + 1} Adventure`,
          activities: [
            i === 0 ? `Arrive at ${data.destination} Airport/Station` : `Morning breakfast at hotel`,
            `Visit ${dayPlaces[0] || destInfo.places[0]}`,
            dayPlaces[1] ? `Explore ${dayPlaces[1]}` : "Local market exploration",
            i === days - 1 ? "Pack and depart" : "Evening leisure time"
          ]
        });
      }

      const itinerary = {
        destination: data.destination,
        duration: `${data.startDate} to ${data.endDate}`,
        budget: data.budget,
        travellers: data.travellers,
        coordinates: { lat: destInfo.lat, lon: destInfo.lon },
        plan: plan,
        hotels: [
          { 
            name: `${data.destination} Grand Hotel`, 
            rating: "4.5 stars", 
            price: data.budget === "luxury" ? "$250/night" : data.budget === "moderate" ? "$120/night" : "$60/night",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
          },
          { 
            name: `${data.destination} City Inn`, 
            rating: "4.0 stars", 
            price: data.budget === "luxury" ? "$180/night" : data.budget === "moderate" ? "$90/night" : "$45/night",
            image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500"
          }
        ],
        flights: [
          { airline: "AirTravel Express", price: data.budget === "luxury" ? "$450" : "$280", duration: "4h 30m" },
          { airline: "SkyHigh Airlines", price: data.budget === "luxury" ? "$380" : "$220", duration: "5h 15m" }
        ],
        railways: [
          { train: "Express Rail", price: "$80", duration: "6h" },
          { train: "Super Fast", price: "$120", duration: "4h 30m" }
        ],
        places: destInfo.places.map((place: string, idx: number) => ({
          name: place,
          description: `Famous attraction in ${data.destination}`,
          image: `https://images.unsplash.com/photo-${1500000000000 + idx * 100000}?w=400`
        }))
      };

      res.json(itinerary);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        console.error("Itinerary error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });

  return httpServer;
}
