import {db} from '../db/database.js'
import { usersTable } from '../db/schema.js';
import { eq } from 'drizzle-orm'


/**
 * Permet de récupérer tous les utilisateurs.
 * Ils sont triés par date de création décroissante.
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await db.select().from(usersTable).orderBy('createdAt', 'desc');
        res.status(200).json(users)
        
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch users'
        })
    }
};

/**
 * Permet de récupérer un utilisateur via son ID
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
export const getUser = async (req, res) => {
    const {userId} = req.params;

    try {
        const user = await db.select().from(usersTable).where(eq(usersTable.id, userId));
        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch user'
        })
    }
};




/**
 * Permet de supprimer un utilisateur via son ID
 * @param {request} req 
 * @param {response} res 
 * @returns {void}
 */
export const deleteUser = async (req, res) => {
    const {userId} = req.params;

    try {
        const [deleteUser] = await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();

        if(!deleteUser){
            return res.status(404).json({error: 'User not found'});
        }

        res.status(202).json(deleteUser); 

    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete user'
        })
    }
}