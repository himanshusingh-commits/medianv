import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'YOUR_SECRET_KEY';

const users = [
    {
        id: 1,
        name: "john",
        email: "john@gmail.com",
        password: "john12345", 
        role: "admin"          
    },
    {
        id: 2,
        name: "rahul",
        email: "test@gmail.com",
        password: "test12345",
        role: "user"          
    }
];

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body; 

        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const emailExists = users.find(u => u.email === email);
        if (emailExists) return res.status(409).json({ error: 'Email already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: Date.now(),
            name: name,
            email: email,
            password: hashedPassword,
            role: role || "user"
        };

        users.push(newUser);
        res.status(201).json({ message: "User created", user: { id: newUser.id, name: newUser.name, role: newUser.role } });
    } catch (error) {
        res.status(500).json({ message: "Signup error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    try {
       
        const isMatched = user.id <= 2 ? password === user.password : await bcrypt.compare(password, user.password);

        if (isMatched) {

            const payLoad = { 
                id: user.id,
                role: user.role 
            };

            const accessToken = jwt.sign(payLoad, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: "LOGIN SUCCESSFULLY", token: accessToken, role: user.role });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
}

export const getDetails = (req, res) => {
    try {

        const userId = req.user.id;
        const user = users.find(u => u.id === userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const isAdmin = req.user.role === 'admin';

        res.status(200).json({
            message: isAdmin ? "Admin Access: Getting full details" : "User Access: Getting details",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                adminPrivileges: isAdmin
            }
        });
    } catch (err) {
        res.status(401).json({ message: "Unauthorized", err: err.message });
    }
}

export default { login, signup, getDetails };
