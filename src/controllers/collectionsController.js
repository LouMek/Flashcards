import { db } from '../db/database.js';
import { collectionsTable, usersTable } from '../db/schema.js';
import { eq, like } from 'drizzle-orm';

export const getCollections = async (req, res) => {
    try {
        const { title } = req.query;

        let query = db.select().from(collectionsTable)

        if(!title) {
            const collections = await db.select().from(collectionsTable).where(eq(collectionsTable.createdBy, req.user.userId));
            return res.status(200).json(collections);
        }

        query = query.where(like(collectionsTable.title, `%${title}%`));

        const [collectionByTitle] = await query;

        if(collectionByTitle.isPublic == 0) {
            return res.status(403).json({
                error: "This collection is private"
            });
        }

        res.status(200).json({
            message: `Collection ${title}`,
            data: collectionByTitle
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch collection"
        });
    }
}

export const createCollection = async (req, res) => {
    const { title, description, isPublic } = req.body;

    try {
        const[newCollection] = await db.insert(collectionsTable).values({
            title,
            description,
            isPublic,
            createdBy: req.user.userId
        }).returning();

        res.status(201).send({
            message: "Collection created",
            data: newCollection
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create collection"
        });
    }
}

export const deleteCollection = async (req, res) => {
    const { id } = req.params;

    try {
        const [created] = await db.select({ createdBy: collectionsTable.createdBy }).from(collectionsTable).where(eq(collectionsTable.id, id));
        const { createdBy } = created;

        if(createdBy != req.user.userId) {
            return res.status(403).json({
                error: "Wrong ID"
            });
        }

        const [deletedCollection] = await db.delete(collectionsTable).where(eq(collectionsTable.id, id)).returning();

        if(!deletedCollection) {
            return res.status(404).json({
                error: "Collection not found"
            });
        }

        res.status(200).json({
            message: `Collection ${id} deleted`,
            data: deletedCollection
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete collection"
        });
    }
}

export const getOneCollection = async (req, res) => {
    const { id } = req.params;

    try {
        const [created] = await db.select({
            createdBy: collectionsTable.createdBy,
            isPublic: collectionsTable.isPublic
        }).from(collectionsTable).where(eq(collectionsTable.id, id));

        const { createdBy, isPublic } = created;

        if(isPublic == 0) {
            if(createdBy != req.user.userId) {
                return res.status(403).json({
                    error: "Wrong ID"
                });
            }
        }

        const [collection] = await db.select().from(collectionsTable).where(eq(collectionsTable.id, id));

        if(!collection) {
            return res.status(404).json({
                error: "Collection not found"
            });
        }

        res.status(200).json({
            message: `Collection ${id}`,
            data: collection
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch collection"
        });
    }
}

export const modifyCollection = async (req, res) => {
    const { id } = req.params;
    const { title, description, isPublic } = req.body;

    try {
        const [created] = await db.select({ createdBy: collectionsTable.createdBy }).from(collectionsTable).where(eq(collectionsTable.id, id));
        const { createdBy } = created;

        if(createdBy != req.user.userId) {
            return res.status(403).json({
                error: "Wrong ID"
            });
        }

        const [modifiedCollection] = await db.update(collectionsTable).set({
            title: title,
            description: description,
            isPublic: isPublic
        }).where(eq(collectionsTable.id, id)).returning();

        if(!modifiedCollection) {
            return res.status(404).json({
                error: "Collection not found"
            });
        }

        res.status(200).json({
            message: `Collection ${id} modified`,
            data: modifiedCollection
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to modify collection"
        });
    }
}