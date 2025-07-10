import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'

import { userRouter } from './routes/user';
import { blogRouter } from './routes/blog';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1/user', userRouter);
app.use('/api/v1/blog', blogRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

