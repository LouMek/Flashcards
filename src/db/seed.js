import { usersTable, collectionsTable, flashcardsTable, revisionsTable } from './schema.js';
import { hashSync } from 'bcrypt';
import { db } from './database.js';

async function seed() {
    try {
        console.log('Seeding database...');

        await db.delete(usersTable);
        await db.delete(collectionsTable);
        await db.delete(flashcardsTable);
        await db.delete(revisionsTable);    

        const seedUsers = [
            {
                email: 'MonAdresse@flashcard.fr',
                firstName: 'Lou',
                lastName: 'Meka',
                password: await hashSync('password123', 12),
                role: 'ADMIN'
            },
            {
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                password: await hashSync('pass1234', 12),
                role: 'USER'
            },            
            {
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'Test',
                password: await hashSync('test1234', 12),
                role: 'USER'
            },            
            {
                email: 'coucou@example.com',
                firstName: 'Baptiste',
                lastName: 'Aubignat',
                password: await hashSync('coucou12', 12),
                role: 'USER'
            }
        ];  

        const createdUsers = await db.insert(usersTable).values(seedUsers).returning();

        const seedCollections = [
            {
                title: 'Base de données',
                description: 'Ceci est une collections dédiée à la révision sur les base de données',
                isPublic: true,
                createdBy: createdUsers[1].id
            },
            {
                title: 'Java',
                description: 'Ceci est une collection dédiée à la révision sur Java',
                isPublic: false,
                createdBy: createdUsers[3].id
            }
        ];

        const createdCollections = await db.insert(collectionsTable).values(seedCollections).returning();

        const seedFlashcards = [
            {
                frontText: 'Que signifie SQL ?',
                backText: 'Structured Query Language',
                frontURL: 'https://test.com',
                backURL: 'https://test.com',
                collectionId: createdCollections[0].id
            },
            {
                frontText: 'Comment voir les données d\'une table en SQL ?',
                backText: 'Requête SELECT',
                frontURL: 'https://test.com',
                backURL: 'https://test.com',
                collectionId: createdCollections[0].id
            },
            {
                frontText: 'Java est-il un langage orienté objet ?',
                backText: 'Oui',
                collectionId: createdCollections[1].id
            },            
            {
                frontText: 'En quelle année a été créé Java ?',
                backText: '1995',
                frontURL: 'https://test.com',
                backURL: 'https://test.com',
                collectionId: createdCollections[1].id
            },
            {
                frontText: 'Quel IDE open-source est très populaire pour développer en Java ?',
                backText: 'Eclipse',
                frontURL: 'https://test.com',
                backURL: 'https://test.com',
                collectionId: createdCollections[1].id
            },
            {
                frontText: 'Java est-il encore utilisé aujourd\'hui ?',
                backText: 'Oui',
                collectionId: createdCollections[1].id
            },
            {
                frontText: 'Comment appelle-t-on un objet en Java ?',
                backText: 'Une classe',
                collectionId: createdCollections[1].id
            }
        ];

        const seedRevisions = [
            
        ];

        const createdFlashcards = await db.insert(flashcardsTable).values(seedFlashcards).returning();

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();