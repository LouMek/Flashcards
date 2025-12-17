import express from 'express';
import usersRouter from './routers/usersRoutes.js';
import authRouter from './routers/authRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());


app.use('/users', usersRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});