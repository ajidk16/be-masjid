import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { mosques } from "./core-tables";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  speaker: varchar("speaker", { length: 160 }),
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
  location: varchar("location", { length: 160 }),
  description: text("description"),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const news = pgTable("news", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }).notNull(),
  content: text("content").notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
  publishedAt: timestamp("published_at").defaultNow().notNull(),
  coverUrl: text("cover_url"),
});

export const mediaPhotos = pgTable("media_photos", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 160 }),
  url: text("url").notNull(),
  takenAt: timestamp("taken_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
