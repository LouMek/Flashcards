import { sqliteTable, text } from 'drizzle-orm/sqlite-core';


export const usersTable = sqliteTable('user', {
    id: text().primaryKey().$default(() => randomUUID()),
    email: text().notNull().unique()
})


