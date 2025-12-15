import { integer } from 'drizzle-orm/gel-core';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { randomUUID } from 'crypto';


export const usersTable = sqliteTable('users', {
    id: text().primaryKey().$default(() => randomUUID()),
    email: text().notNull().unique(),
    firstName: text('first_name', {length: 50}).notNull(),
    lastName: text('last_name', {length: 50}).notNull(),
    password: text({length: 255}).notNull(),
    role: text().notNull().default('USER')
});


export const collectionsTable = sqliteTable('collections', {
    id: text().primaryKey().$default(() => randomUUID()),
    title: text({length : 50}).notNull(),
    description: text({length: 255}),
    isPublic: integer('is_public', {mode: 'boolean'}).notNull().default(false),
    createdBy: text('created_by').references(() => usersTable.id).notNull()
});


export const flashcardsTable = sqliteTable('flashcards', {
    id: text().primaryKey().$default(() => randomUUID()),
    frontText: text('front_text', {length: 50}).notNull(),
    backText: text('back_text', {length: 50}).notNull(), 
    frontURL: text('front_url', {length: 255}),
    backURL: text('back_url', {length: 255}),
    collectionId: text('collection_id').references(() => collectionsTable.id).notNull()
});


export const revisionsTable = sqliteTable('revisions', {
    id: text().primaryKey().$default(() => randomUUID()),
    level: integer().notNull().default(1),
    lastRevision: integer('last_revision', {mode: 'timeStamp'}).notNull().$defaultFn(() => new Date()),
    flashcardId: text('flashcard_id').references(() => flashcardsTable.id).notNull(),
    userId: text('user_id').references(() => usersTable.id).notNull()
});


