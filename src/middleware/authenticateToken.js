import { request } from "express";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * 
 * @param {request} req //Permet de mettre l'auto complétion
 * @param {*} res 
 * @param {*} next 
 */ 
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];  //Permet de vérifier, que authHeader ne soit pas nul, et si oui, alors on passe à la suite.
        //Token dans le header

        if(!token) {
            return res.status(401).json({error: "Token is required"});
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        //Si token non valide (exemple: expiré), 'verify' throw une erreur, et donc on va directement dans le catch.
        const userId = decodedToken.userId; //Stocké à l'intérieur du token.
        req.user = {userId}; //Si on veut ajouter des données; un role par exemple
        // req.user.userId

        const userRole = decodedToken.role;
        req.role = {userRole};
        //req.role.userRole

        next();
    } catch (error) {
        res.status(401).json({error: 'Invalide token'});
    }
}