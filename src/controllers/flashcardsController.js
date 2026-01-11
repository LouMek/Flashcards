import { db } from '../db/database.js'
import { flashcardsTable, collectionsTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

/**
 * Permet de créer une flashcard.
 * Pour cela, envoie une requête POST avec dans le body un frontText et backText, un collectionId
 * et optionnellement avec un frontURL et backURL.
 * Pour ajouter une flashcard dans une collection, il faut que l'utilisateur soit le créateur de la collection.
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
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


/**
 * Permet de supprimer une flashcard.
 * Pour cela, envoie une requête DELETE.
 * Pour supprimer une flashcard, il faut que l'utilisateur soit le créateur de celle-ci.
 * Pour cela on se refere à la collection dont elle fait partie.
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
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



/**
 * Permet de récupérer toutes les flashcards d'une collection.
 * Pour cela, envoie une requête GET avec un paramètre collectionId.
 * Si la collection est privée, l'utilisateur doit être le créateur de celle-ci ou bien un administrateur.
 * Sinon l'utilisateur ne pourra pas consulter les flashcards.
 * Elles sont triées par date de création décroissante.
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
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

/**
 * Permet de récupérer une flashcards.
 * Pour cela, envoie une requête GET avec un paramètre flashcardId.
 * On regarde si la collection est privée, et si oui l'utilisateur doit être le créateur de celle-ci 
 * pour voir la flashcard.
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
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



/**
 * Permet de mettre à jour une flashcard.
 * Pour cela, envoie une requête PUT.
 * Pour supprimer une flashcard, il faut que l'utilisateur soit le créateur de celle-ci.
 * Pour cela on se refere à la collection dont elle fait partie.
 * 
 * @param {*} res 
 * @returns 
 */
export const updateFlashcard = async (req, res) => {
    const { flashcardId } = req.params;
    const { frontText, backText, frontURL, backURL } = req.body;

    try {
        const [flashcard] = (await 
            db.select().from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collectionId, collectionsTable.id))
            .where(eq(flashcardsTable.id, flashcardId))
        );

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        if (flashcard.collections.createdBy != req.user.userId) {
            return res.status(403).json({ error: 'Invalid permission: you need to be the owner of the flashcard' })
        }

        const [updateFlashcard] = await db.update(flashcardsTable).set({
            frontText: frontText,
            backText: backText,
            frontURL: frontURL,
            backURL: backURL
        }).where(eq(flashcardsTable.id, flashcardId)).returning();

        if(!updateFlashcard) {
            return res.status(404).json({
                error: "Flashcard not found"
            });
        }

        res.status(200).json({
            message: `Flashcard ${flashcardId} modified`,
            data: updateFlashcard
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to modify flashcard"
        });
    }
}