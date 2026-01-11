import { ZodError } from 'zod';

export const validateBody = (schema) => {
    //closure
    return (req, res, next) => {
        try{
            req.body = schema.parse(req.body); 
            next(); 
        } catch(error) {
            if(error instanceof ZodError){
                return res.status(400).send({
                    error: 'Validation failed', 
                    details: error.issues.map((issue) => issue.message), //map est comme un foreach.
                });
            }
            res.status(500).send({error: 'Internal server error'});
        }
    };
}

export const validateParams = (schema) => {
    return (req, res, next) => {
        try{
            req.params = schema.parse(req.params);
            next();
        } catch(error) {
            if(error instanceof ZodError){
                return res.status(400).send({
                    error: 'Invalid params', 
                    details: error.issues.map((issue) => issue.message), //map est comme un foreach.
                });
            }
            res.status(500).send({error: 'Internal server error'});
        }
    };
}





