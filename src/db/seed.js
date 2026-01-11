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
                password: await hashSync('pass', 12),
                role: 'USER'
            },            
            {
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'Test',
                password: await hashSync('test', 12),
                role: 'USER'
            },            
            {
                email: 'coucou@example.com',
                firstName: 'cou',
                lastName: 'cou',
                password: await hashSync('coucou', 12),
                role: 'USER'
            }
        ];  

        const createdUsers = await db.insert(usersTable).values(seedUsers).returning();

        const seedCollections = [
            {
                title: 'Ceci est un titre',
                description: 'Ceci est une description',
                isPublic: true,
                createdBy: createdUsers[0].id
            }
        ];

        const createdCollections = await db.insert(collectionsTable).values(seedCollections).returning();

        const seedFlashcards = [
            {
                frontText: 'Ceci est un frontText1',
                backText: 'Ceci est un backText1',
                frontURL:  'Ceci est un frontText1',
                backURL:  'Ceci est un backText1',
                collectionId: createdCollections[0].id
            },
            {
                frontText: 'Ceci est un frontText1',
                backText: 'Ceci est un backText1',
                frontURL:  'Ceci est un frontText1',
                backURL:  'Ceci est un backText1',
                collectionId: createdCollections[0].id
            },
            {
                frontText: 'Ceci est un frontText3',
                backText: 'Ceci est un backText3',
                collectionId: createdCollections[0].id
            },            
            {
                frontText: 'Ceci est un frontText4',
                backText: 'Ceci est un backText4',
                frontURL:  'Ceci est un frontText4',
                backURL:  'Ceci est un backText4',
                collectionId: createdCollections[0].id
            },
        ];

        const createdFlashcards = await db.insert(flashcardsTable).values(seedFlashcards).returning();

        console.log('Database seeded successfully.');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

seed();