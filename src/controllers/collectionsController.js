import { db } from '../db/database.js';
import { collectionsTable } from '../db/schema.js';
import { eq, like } from 'drizzle-orm';

/**
 * Cette fonction renvoie les collections appartenant à l'utilisateur authentifié.
 * Si l'on précise le titre dans l'url, cela renvoie la collection correspondante si celle-ci est publique.
 * @param {request} req 
 * @param {*} res 
 * @returns 
 */
export const getCollections = async (req, res) => {
    try {
        // On récupère le titre passé en paramètres de la requête HTTP
        const { title } = req.query;

        // Préparation de la requête sur la table collectionsTable
        let query = db.select().from(collectionsTable);

        // Vérifie si un titre est passé dans l'url de la requête, s'il n'y en a pas, cela renvoie les collections de l'utilisateur authentifié.
        if(!title) {
            const collections = await db.select().from(collectionsTable).where(eq(collectionsTable.createdBy, req.user.userId));
            return res.status(200).json(collections);
        }

        // Filtrage de la requête en fonction du titre passé en paramètres
        query = query.where(like(collectionsTable.title, `%${title}%`));

        // Récupération de la collection voulue
        const [collectionByTitle] = await query;

        // Renvoie une erreur si aucune collection n'a été trouvée
        if(!collectionByTitle) {
            return res.status(404).json({
                error: 'Collection not found'
            });
        }

        // Vérifie si la collection spécifiée par le titre est publique, ou que l'utilisateur est autorisé à consulter. Sinon renvoie un code d'erreur
        if(!collectionByTitle.isPublic && collectionByTitle.createdBy != req.user.userId && req.role.userRole != 'ADMIN') {
            return res.status(403).json({
                error: 'Invalid permission: this collection is private'
            });
        }

        // Revoie la collection spécifiée par le titre
        res.status(200).json({
            message: `Collection ${title}`,
            data: collectionByTitle
        });
    } catch (error) {
        // Si la requête HTTP ne s'est pas bien passée, renvoie un code d'erreur
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch collection'
        });
    }
}

/**
 * Cette fonction permet à l'utilisateur authentifié de créer une collection.
 * @param {request} req 
 * @param {*} res 
 */
export const createCollection = async (req, res) => {
    // On récupère les ces attributs dans le corps de la requête HTTP
    const { title, description, isPublic } = req.body;

    try {
        // On insère une nouvelle collection dans la base avec les valeurs de la reqûete HTTP
        const[newCollection] = await db.insert(collectionsTable).values({
            title,
            description,
            isPublic,
            createdBy: req.user.userId // Obtenu grâce au token
        }).returning();

        // Renvoie une erreur si aucune collection n'a pu être créée
        if(!newCollection) {
            return res.status(404).json({
                error: 'Collection not found'
            });
        }

        // On renvoie un message avec la nouvelle collection créée
        res.status(201).send({
            message: 'Collection created',
            data: newCollection
        });
    } catch (error) {
        // Si la requête HTTP ne s'est pas bien passée, renvoie un code d'erreur
        console.error(error);
        res.status(500).json({
            error: 'Failed to create collection'
        });
    }
}

/**
 * Cette fonction permet à l'utilisateur authentifié de supprimer une de ses propres collections.
 * @param {request} req 
 * @param {*} res 
 * @returns 
 */
export const deleteCollection = async (req, res) => {
    // On récupère l'ID passé en paramètres de la reqûete HTTP
    const { collectionId } = req.params;

    try {
        // On exécute une requête select afin de récupérer l'ID du créateur de la collection que l'on veut supprimer
        const [created] = await db.select({ createdBy: collectionsTable.createdBy }).from(collectionsTable).where(eq(collectionsTable.id, collectionId));

        // Si l'ID passé en paramètres ne correspond à aucune collection, on renvoie une erreur
        if (!created) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        const { createdBy } = created;


        // Si la collection spécifiée n'appartient pas à l'utlisateur authentifié ou n'est pas admin, on renvoie une erreur
        if(createdBy != req.user.userId && req.role.userRole != 'ADMIN') {
            return res.status(403).json({
                error: 'Invalid permission: you need to be the owner of the collection'
            });
        }

        // Requête permettant de supprimer la collection si l'ID en paramètres correspond
        const [deletedCollection] = await db.delete(collectionsTable).where(eq(collectionsTable.id, collectionId)).returning();

        // On renvoie un message avec la collection que l'on vient de supprimer
        res.status(200).json({
            message: `Collection ${collectionId} deleted`,
            data: deletedCollection
        });
    } catch (error) {
        // Si la requête HTTP ne s'est pas bien passée, renvoie un code d'erreur
        console.error(error);
        res.status(500).json({
            error: 'Failed to delete collection'
        });
    }
}

/**
 * Cette fonction permet de récupérer une collection grâce à son ID.
 * @param {request} req 
 * @param {*} res 
 * @returns 
 */
export const getOneCollection = async (req, res) => {
    // On récupère l'ID passé en paramètres de la reqûete HTTP
    const { collectionId } = req.params;

    try {
        // On vérifie qui est le créateur de la collection et si celle-ci est publique ou non
        const [created] = await db.select({
            createdBy: collectionsTable.createdBy,
            isPublic: collectionsTable.isPublic
        }).from(collectionsTable).where(eq(collectionsTable.id, collectionId));

        // Si l'ID passé en paramètres ne correspond à aucune collection, on renvoie une erreur
        if (!created) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        const { createdBy, isPublic } = created;

        // Vérifie si la collection spécifiée par le titre est publique, ou que l'utilisateur est autorisé à consulter. Sinon renvoie un code d'erreur
        if(!isPublic && createdBy != req.user.userId && req.role.userRole != 'ADMIN') {
            return res.status(403).json({
                error: 'Invalid permission: this collection is private'
            });
        }

        // Récupération de la collection grâce à son ID
        const [collection] = await db.select().from(collectionsTable).where(eq(collectionsTable.id, collectionId));

        // On renvoie un message contenant la collection voulue
        res.status(200).json({
            message: `Collection ${collectionId}`,
            data: collection
        });
    } catch (error) {
        // Si la requête HTTP ne s'est pas bien passée, renvoie un code d'erreur
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch collection'
        });
    }
}

/**
 * Cette fonction permet à l'utilisateur authentifié de modifier une de ses collections (Titre, description, visibilité).
 * @param {request} req 
 * @param {*} res 
 * @returns 
 */
export const modifyCollection = async (req, res) => {
    // On récupère l'ID passé en paramètre de la requête HTTP ainsi que les valeurs à modifier dans le body de la requête HTTP
    const { collectionId } = req.params;
    const { title, description, isPublic } = req.body;

    try {
        // On récupère l'ID du créateur de la collection
        const [created] = await db.select({ createdBy: collectionsTable.createdBy }).from(collectionsTable).where(eq(collectionsTable.id, collectionId));
        
        // Renvoie une erreur si l'ID passé en paramètres de la requête HTTP ne correspond à aucune collection
        if (!created) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        const { createdBy } = created;

        // On vérifie que l'utilisateur authentifié soit bien le créateur de la collection spécifiée,
        // sinon on renvoie une erreur
        if(createdBy != req.user.userId) {
            return res.status(403).json({
                error: 'Invalid permission: you need to be the owner of the collection'
            });
        }

        // On modifie la collection avec les valeurs que l'on a renseignées dans le body de la requête HTTP
        const [modifiedCollection] = await db.update(collectionsTable).set({
            title: title,
            description: description,
            isPublic: isPublic
        }).where(eq(collectionsTable.id, collectionId)).returning();

        // Renvoie un message contenant la colelction modifiée
        res.status(200).json({
            message: `Collection ${collectionId} modified`,
            data: modifiedCollection
        });
    } catch (error) {
        // Si la requête HTTP ne s'est pas bien passée, renvoie un code d'erreur
        console.error(error);
        res.status(500).json({
            error: 'Failed to modify collection'
        });
    }
}