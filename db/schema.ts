import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const teacherLikes = pgTable("teacher_likes", {
  teacherId: text("teacher_id").notNull(),
  voterId: text("voter_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  primaryKey({ columns: [table.teacherId, table.voterId] }),
]);
