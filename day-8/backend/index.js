import express from 'express'
import sequelize from './db/db.js';
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
const app = express()

const PORT= 4000
app.use(cors()); 
app.use(express.json());
app.use('/api',authRoutes)

sequelize.sync({ alter: false })
  .then(() => console.log("Database & tables synced"))
  .catch(err => console.error("Error syncing database:", err));

  
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})