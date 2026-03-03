
  import { pgTable, text, serial, boolean } from "drizzle-orm/pg-core";
  import { createInsertSchema } from "drizzle-zod";
  import { z } from "zod";

  export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    isAdmin: boolean("is_admin").default(false),
  });

  export const insertUserSchema = createInsertSchema(users).omit({ id: true });

  export const generateItinerarySchema = z.object({
    destination: z.string().min(1, "Destination is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    budget: z.string().min(1, "Budget is required"),
    travellers: z.string().min(1, "Number of travellers is required"),
  });

  export type User = typeof users.$inferSelect;
  export type InsertUser = z.infer<typeof insertUserSchema>;
  