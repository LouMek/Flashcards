import { db } from '../db/database.js';
import { usersTable } from '../db/schema.js';
import { hash, compare} from 'bcrypt';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const register = async (req, res) => {
    const {email, firstName, lastName, password} = req.body;

    const hashedPassword = await hash(password, 12);
    
    try {
        const [newUser] = await db.insert(usersTable).values({
            email,
            firstName,
            lastName,
            password: hashedPassword,
        }).returning(
            {
                email: usersTable.email, 
                firstName: usersTable.firstName,
                lastname: usersTable.lastName,
                id: usersTable.id,
            });

        const token = jwt.sign({userId: newUser.id, role: newUser.role}, process.env.JWT_SECRET, {expiresIn: '24h'}); //Permet de créer un token -- data - clé secrète - expiration

        res.status(201).json({
            message: 'User created',
            userData: newUser,
            token,
        });
    } catch (error) {
        if(error.cause.code === 'SQLITE_CONSTRAINT_UNIQUE') { 
            return res.status(409).json({
                error: 'Email already used'
            });
        }

        console.log(error);
        res.status(500).json({
            error: 'Register failed'
        });
    };
}

/**
 * 
 * @param {request} req 
 * @param {response} res 
 */
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email));

        if(!user) {
            return res.status(401).json({error: 'Invalid email or password'});
        };

        const isValidPassword = await compare(password, user.password);

        if(!isValidPassword) {
            return res.status(401).json({error: 'Invalid email or password'});
        };

        const token = jwt.sign({userId: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '24h'});
        
        res.status(201).json({
            message: 'login successful',
            userData: {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                id: user.id
            },
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Login failed'
        });
    };
}
