import express from 'express' import cors from 'cors' import bcrypt from 'bcrypt' const app=express() const PORT = 4000 const users =[{user:"rahul",email:"test@gmail.com",passowrd:"test"}] 
app.use(cors()) const myLogger = (req,res,next)=>{ console.log("Middleware is authenticated ") next(); } 


app.post('/signup',async(req,res)=>{
     try{ const {name,email,password}=req.body //const userId = Number(req.params.id); if(!email||!password) return res.status(401).json({message:"required both mail and pass"}) const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
     if (!emailPattern.test(email)) return res.status(400).json({ message: "Invalid email" }); 
     const emailExists = users.find(u => u.email === email); 
     if (emailExists) { return res.status(409).json({ error: 'Email already exists.' }); } 
     const hashedPassword = await bcrypt.hash(password, 10); 
     const newUser= { id:Date.now(), name:name, email:email, password:hashedPassword } 
     console.log(newUser) users.push(newUser);//user arr is alrerady above created res.status(201).json({message:"User us created",user: { id: newUser.id, username: newUser.name } }) }
     
     catch{ console.log(users) return res.status(401).json({message:"not posted email"}) } }) 
     
     
     
     app.listen(PORT,()=>{ console.log(`Server is running on ${PORT}`) })


     const authorizeRole = (role)=>{
    return (req,res,next)=>{
        if(req.user.role!=role){
            return res.status(403).json({error:"forbidden insuffiecinet"})
        }
        next();
    }
}











import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'YOUR_SECRET_KEY';

const users = []; 

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const emailExists = users.find(u => u.email === email);
        if (emailExists) return res.status(409).json({ error: 'Email already exists.' });

        if (password.length < 8) return res.status(400).json({ message: "Password must be at least 8 chars" });


        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now(), 
            name,
            email,
            password: hashedPassword
        };

        users.push(newUser);

        res.status(201).json({
            message: "User created",
            user: { id: newUser.id, name: newUser.name }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during signup" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

      
        const isMatched = await bcrypt.compare(password, user.password);

        if (isMatched) {
            const payLoad = { id: user.id }; 
            const accessToken = jwt.sign(payLoad, SECRET_KEY, { expiresIn: '1h' });

            return res.status(200).json({ message: "LOGIN SUCCESSFULLY", token: accessToken });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error during login" });
    }
}

export const getDetails = (req, res) => {
    try {
       
        const userId = req.user.id;
        const user = users.find(u => u.id === userId);

        if (!user) return res.status(404).json({ message: "User not found" });

        const { password, ...userWithoutPassword } = user;

        res.status(200).json({ 
            message: 'User details retrieved', 
            user: userWithoutPassword 
        });
    } catch (err) {
        res.status(401).json({ message: "Could not retrieve user details", error: err.message });
    }
}

export default { login, signup, getDetails };






import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import users from '../model/user.js'; 

const SECRET_KEY = process.env.SECRET_KEY || 'YOUR_SECRET_KEY';

export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }


        const emailExists = await users.findOne({ where: { email } });
        if (emailExists) {
            return res.status(409).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

   
        const newUser = await users.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user" 
        });

        res.status(201).json({ 
            message: "User created", 
            user: { id: newUser.id, name: newUser.name, role: newUser.role } 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Signup error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await users.findOne({ where: { email } });

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
            
            res.status(200).json({ 
                message: "LOGIN SUCCESSFULLY", 
                token: accessToken, 
                role: user.role 
            });
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

        const user = await users.findByPk(userId);

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
};

export default { login, signup, getDetails };
