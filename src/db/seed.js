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

        const createdFlashcards = await db.insert(flashcardsTable).values(seedFlashcards).returning();

        const seedRevisions = [
            {
                level: 1,
                lastRevision: 1768170967,
                nextRevision: 1768248851,
                flashcardId: createdFlashcards[0].id,
                userId: createdUsers[2].id
            },
            {
                level: 2,
                lastRevision: 1768076051,
                nextRevision: 1768248851,
                flashcardId: createdFlashcards[0].id,
                userId: createdUsers[2].id
            },
            {
                level: 3,
                lastRevision: 1767989651,
                nextRevision: 1768335251,
                flashcardId: createdFlashcards[1].id,
                userId: createdUsers[2].id
            },
            {
                level: 4,
                lastRevision: 1767903251,
                nextRevision: 1768594451,
                flashcardId: createdFlashcards[1].id,
                userId: createdUsers[3].id
            },
            {
                level: 5,
                lastRevision: 1767298451,
                nextRevision: 1768680851,
                flashcardId: createdFlashcards[1].id,
                userId: createdUsers[3].id
            }
        ];

        const createdRevisions = await db.insert(revisionsTable).values(seedRevisions).returning();

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();