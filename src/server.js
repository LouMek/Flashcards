import express from 'express';
import usersRouter from './routers/usersRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.use('/users', usersRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});