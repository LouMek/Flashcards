import { db } from '../db/database.js'
import { flashcardsTable, collectionsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';


export const createFlashcard = async (req, res) => {
    const { frontText, backText, frontURL, backURL } = req.body;
    const { collectionId } = req.params;

    try {

        const [collection] = (await
            db.select().from(collectionsTable)
            .where(eq(collectionsTable.id, collectionId))
        )

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        if (collection.createdBy !=  req.user.userId) {
            return res.status(403).json({ error: 'Invalid permission: you need to be the owner of the collection' })
        }

        const [newFlashcard] = await db.insert(flashcardsTable).values({
            frontText,
            backText,
            frontURL,
            backURL,
            collectionId
        }).returning();
        res.status(201).json({
            message: 'Flashcard created',
            data: newFlashcard
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to create flashcards'
        })
    }
}

//FONCTION POUR MODIFIER UNE FLASHCARD
export const updateFlashcard = async (req, res) => {
    const { frontText, backText, frontURL, backURL } = req.body;
    const { id } = req.params;

    try {
        const [newFlashcard] = await db.insert(flashcardsTable).values({
            frontText,
            backText,
            frontURL,
            backURL,
            collectionId: id
        }).returning();
        res.status(201).json({
            message: 'Flashcard created',
            data: newFlashcard
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to create flashcards'
        })
    }
}



//FONCTION POUR SUPPRIMER UNE FLASHCARD
export const deleteFlashcard = async (req, res) => {
    const { flashcardId } = req.params;


    try {

        const [deleteFlashcard] = (await 
            db.select().from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collectionId, collectionsTable.id))
            .where(eq(flashcardsTable.id, flashcardId))
        );

        if (!deleteFlashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        if (deleteFlashcard.collections.createdBy != req.user.userId) {
            return res.status(403).json({ error: 'Invalid permission: you need to be the owner of the flashcard' })
        }

        await db.delete(flashcardsTable).where(eq(flashcardsTable.id, deleteFlashcard.flashcards.id));

        res.status(202).json(deleteFlashcard.flashcards); 

    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete flashcard'
        })
    }
}



//FONCTION POUR RÉCUPÉRER TOUTES LES FLASHCARDS D'UNE COLLECTION
export const getFlashcardsByCollection = async (req, res) => {
    const { collectionId } = req.params;

    try {
        const [collection] = (await
            db.select().from(collectionsTable)
            .where(eq(collectionsTable.id, collectionId))
        )

        const flashcards = (await 
            db.select().from(flashcardsTable)
            .where(eq(flashcardsTable.collectionId, collection.id))
            .orderBy('createdAt', 'desc')
        );


        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        if(!collection.isPublic && collection.createdBy != req.user.userId && req.role.userRole != 'ADMIN') {
            return  res.status(403).json({ error: 'Invalid permission: this collection is private' })
        }

        res.status(200).json(flashcards) 
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch flashcards'
        })
    }
}


export const getFlashcard = async (req, res) => {
    const { flashcardId } = req.params;

    try {
        const [flashcard] = (await 
            db.select().from(flashcardsTable)
            .where(eq(flashcardsTable.id, flashcardId))
        );

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcards not found' });
        }

        const [collection] = (await
            db.select().from(collectionsTable)
            .where(eq(collectionsTable.id, flashcard.collectionId))
        )

        if(!collection.isPublic && collection.createdBy != req.user.userId && req.role.userRole != 'ADMIN') {
            return  res.status(403).json({ error: 'Invalid permission: this flashcard is in a private collection' })
        }

        res.status(200).json(flashcard) 
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch flashcard'
        })
    }
}