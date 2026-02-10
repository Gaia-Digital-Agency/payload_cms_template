import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'

// Drizzle is optional in this starter. This small table exists to keep
// `pnpm db:generate` and `pnpm db:migrate` functional out of the box.
export const appSettings = pgTable('app_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

