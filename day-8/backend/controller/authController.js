
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user.js'

const SECRET_KEY = 'YOUR_SECRET_KEY';
console.log('User: ', typeof User);
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }


        const emailExists = await User.findOne({ where: { email } });
        if (emailExists) {
            return res.status(409).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

   
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "User" 
        });

        res.status(201).json({ 
            message: "User created", 
            User: { id: newUser.id, name: newUser.name, role: newUser.role } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;


        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if (isMatched) {
            const payLoad = { 
                id: user.id, 
                role: user.role
             };
            const accessToken = jwt.sign(payLoad, SECRET_KEY, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ user:payLoad }, SECRET_KEY, { expiresIn: '1d' });
            res.set('Access-Control-Allow-Origin' ,'*')
            res.status(200).json({ message: "LOGIN SUCCESSFULLY", token:accessToken,refresh:refreshToken, role: user.role });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Login error" });
    }
};

export const getDetails = async (req, res) => {
    try {
     
        const userId = req.user.id; 

        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const isAdmin = req.user.role === 'admin';

        res.status(200).json({
            message: isAdmin ? "Admin Access" : "User Access",
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(401).json({ message: "Unauthorized", err: err.message });
    }
};


export const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(401).json({ message: "Refresh Token is required" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Refresh token is invalid or expired" });
        }

        const newAccessToken = jwt.sign(
            { id: decoded.user.id, role: decoded.user.role }, 
            SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            accessToken: newAccessToken
        });
    });
};

export default { login, signup, getDetails,refreshToken };
