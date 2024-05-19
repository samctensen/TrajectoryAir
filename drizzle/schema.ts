import { customType, doublePrecision, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

export type Point = {
  longitude: number;
  latitude: number;
};

export const pointDB = customType<
  {
      data: Point;
      driverData: string;
  }
>({
  dataType() {
      return 'GEOMETRY(POINT, 4326)';
  },
  toDriver(value: Point): string {
      return `SRID=4326;POINT(${value.longitude} ${value.latitude})`;
  },
  fromDriver(value: string): Point {
      const matches = value.match(/POINT\((?<longitude>[\d.-]+) (?<latitude>[\d.-]+)\)/);
      const { longitude, latitude } = matches.groups;
      return {
          longitude: parseFloat(longitude),
          latitude: parseFloat(latitude),
      };
  },
});

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
