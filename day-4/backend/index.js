import express from 'express';
import cors from 'cors'
import patientMiddleware from './middleware/authMiddleware.js';
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())
let users = [
    { id: 1, fname: "Rahul", Last: "Singh", email: "rahul@gmail.com", phone: "9876543210", gender: "M", preference: "General", DOB: "1995-01-01" },
    { id: 2, fname: "Himanshu", Last: "Singh", email: "himanshusingh@gmail.com", phone: "9876543212", gender: "M", preference: "Pediatrics", DOB: "1998-05-05" }
];

const existingPreferences = ["General", "Pediatrics", "Neurology"];






app.post('/patient', (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = users.slice(startIndex, endIndex);

        res.status(200).json({
            page,
            limit,
            totalUsers: users.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching data" });
    }
});


app.post('/patient', patientMiddleware, (req, res) => {
    const newP = { id: users.length + 1, ...req.body };
    users.push(newP);
    res.status(201).json({ message: "Created successfully", newP });
});


app.put('/user/:id', patientMiddleware, (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    users[userIndex] = { id: userId, ...req.body };
    res.status(200).json({ message: "Updated successfully", data: users[userIndex] });
});


app.delete('/user/:id', (req, res) => {
    const userId = Number(req.params.id);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    const deleted = users.splice(userIndex, 1);
    res.status(200).json({ message: "Deleted successfully", deleted });
});


app.listen(PORT, () => console.log(`Server on ${PORT}`));
