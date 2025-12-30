import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('testDb', 'postgres', '12345', {
  host: 'localhost',
  port: 5432, 
  dialect: 'postgres', 
  logging: false, 
});


async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); 
  }
}

connectDB();


export default sequelize;
