import { doublePrecision, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export const coordinatesTable = pgTable('coordinates', {
  id: serial('id').primaryKey(),
  latitude: doublePrecision('latitude').notNull(),
  longitude: doublePrecision('longitude').notNull()
});

export const airQualityTable = pgTable('airquality', {
  id: serial('id').primaryKey(),
  coordinateID: integer('coordinate_id')
    .notNull()
    .references(() => coordinatesTable.id, { onDelete: 'cascade' }),
  date: timestamp('date').notNull(),
  airquality: integer("airquality").notNull()
});
