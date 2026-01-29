import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const generateItinerarySchema = z.object({
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.string(),
  travellers: z.coerce.number().min(1),
});

export type GenerateItineraryRequest = z.infer<typeof generateItinerarySchema>;
