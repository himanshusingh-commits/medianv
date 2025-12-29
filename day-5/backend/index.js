import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'

const app = express();
const PORT = 4000;
app.use(express.json());



app.use(cors());


app.use('/api',authRoutes)





app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
