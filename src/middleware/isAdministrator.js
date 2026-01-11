import { request } from 'express';

/**
 * 
 * @param { request } req
 * @param {*} res
 * @param {*} next
 * @returns 
 */
export const isAdministrator = (req, res, next) => {
    try {
        if(req.role.userRole !== 'ADMIN') {
            return res.status(401).json({ message: 'Access denied. Administrator role required.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error.' });
    }
};