import { db } from '../db/database.js';
import { collectionsTable, usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const getAllCollections = async (req, res) => {
    try {
        const collections = await db.select().from(collectionsTable);
        res.status(200).json(collections);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch collections'
        });
    }
}

export const createCollection = async (req, res) => {
    const { title, description } = req.body;

    try {
        const[newCollection] = await db.insert(collectionsTable).values({
            title,
            description,
            createdBy: req.user.id
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

        if(!isPublic) {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch collection"
        });
    }
}