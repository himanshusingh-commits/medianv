import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'
import sequelize from './db/db.js';
const app = express();
const PORT = 4000;
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use('/api',authRoutes)

sequelize.sync({ alter: false })
  .then(() => console.log("Database & tables synced"))
  .catch(err => console.error("Error syncing database:", err));

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
