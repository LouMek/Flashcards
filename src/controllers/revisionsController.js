import { db } from '../db/database.js'
import { flashcardsTable, collectionsTable } from '../db/schema.js';
import { eq, lte, and } from 'drizzle-orm';
import { revisionsTable } from '../db/schema.js';

/**
 * Permet de récupérer toutes les flashcards d'une collection qu'il faut réviser.
 * Pour cela, envoie une requête GET avec un paramètre collectionId.
 * Si la collection est privée, l'utilisateur doit être le créateur de celle-ci ou bien un administrateur.
 * Sinon l'utilisateur ne pourra pas consulter les flashcards à réviser, même si la collection a été publique dans le passé.
 * Elles sont triées par date de création décroissante.
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
export const getRevisionsByCollection = async (req, res) => {
    const { collectionId } = req.params;

    try {
        const [collection] = (await
            db.select().from(collectionsTable)
            .where(eq(collectionsTable.id, collectionId))
        );

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        if(!collection.isPublic && collection.createdBy != req.user.userId && req.role.userRole != 'ADMIN') {
            return  res.status(403).json({ error: 'Invalid permission: this collection is private' });
        }

        const [flashcards] = (await 
            db.select().from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collectionId, collectionsTable.id))
            .innerJoin(revisionsTable, eq(flashcardsTable.id, revisionsTable.flashcardId))
            .where(lte(revisionsTable.nextRevision, new Date().getTime()))
        );

        if (!flashcards) {
            return res.status(200).json({ Message: 'Nothing to fetch...' });
        }

        res.status(200).json(flashcards) 
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch flashcards'
        });
    }
}

/**
 * Permet de créer une révision.
 * Pour ajouter une révision, il faut que la flashcard soit publique ou que la personne soit le créateur de la flashcard.
 * 
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
export const createOrUpdateRevision = async (req, res) => {
    //Nombre de jours à ajouter en fonction du level
    const days = {1: 1, 2: 2, 3: 4, 4: 8, 5: 16};
    console.log(req.user.userId);

    const { flashcardId } = req.params;
    const { level } = req.query;

    try {
        const [flashcard] = (await 
            db.select().from(flashcardsTable)
            .innerJoin(collectionsTable, eq(flashcardsTable.collectionId, collectionsTable.id))
            .where(eq(flashcardsTable.id, flashcardId))
        );

        if (!flashcard) {
            return res.status(404).json({ error: 'Flashcard not found' });
        }

        // Si on est pas le créateur de la collection et que la collection n'est pas publique (même si on est admin), ne pourra pas créer la révision
        // Même si la collection fut publique dans le passé.
        if (flashcard.collections.createdBy != req.user.userId && !flashcard.collections.isPublic) {
            return res.status(403).json({ error: 'Invalid permission: you need to be the owner of the collection' });
        }

        const [revision] = await db.select().from(revisionsTable)
            .where(and(eq(revisionsTable.flashcardId, flashcardId), eq(revisionsTable.userId, req.user.userId)));

        console.log(revision);
        // Si la révision n'existe pas, on la crée
        if(!revision) {
            const now = new Date();
            const next = new Date(now);
            next.setDate(next.getDate() + days[level ? level : 1]);
            await db.insert(revisionsTable).values({
                // Si il n'y a pas de level, on met 1
                level: level ? level : 1,
                lastRevision: now,  
                // On ajoute le nombre de jours en fonction du level
                nextRevision: next,
                flashcardId: flashcardId,
                userId: req.user.userId
            });
        } else {
            const now = new Date();
            const next = new Date(now);
            next.setDate(next.getDate() + days[level ? level : revision.level]);
            // Sinon on la met à jour
            await db.update(revisionsTable).set({ 
                    //Si il n'y a pas de level, on garde le level actuel
                    level: level ? level : revision.level,
                    lastRevision: now,
                    //On modifie la date de la prochaine révision en fonction du level
                    nextRevision: next
                })
                .where(eq(revisionsTable.id, revision.id)
            );
        }   
        
        res.status(201).json({
            message: 'Revision created',
            flashcard: flashcard,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Failed to create revision'
        });
    }
}
