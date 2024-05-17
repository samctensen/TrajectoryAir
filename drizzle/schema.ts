import {
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
 
export const UsersTable = pgTable(
  'users',
  {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    image: text('image').notNull(),
    createdAt: timestamp('createdAt').defaultNow().notNull(),
  },
  (users) => {
    return {
      uniqueIdx: uniqueIndex('unique_idx').on(users.email),
    };
  },
);