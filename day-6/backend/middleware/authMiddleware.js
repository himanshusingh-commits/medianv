import jwt from 'jsonwebtoken'


const SECRET_KEY="YOUR_SECRET_KEY"

export const authentication = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: "Access Denied: No token provided" });

    jwt.verify(token, SECRET_KEY, (err, decodedPayload) => {
        if (err) return res.status(403).json({ message: "Invalid or Expired Token" });

        req.user = decodedPayload; 
        next();
    });
}

export const authRole= (role)=>{
    return (req,res,next)=>{
            if(req.user.role!=role){
            return res.status(403).json({error:"forbidden insuffiecinet"})
        }
        next();
    }
}