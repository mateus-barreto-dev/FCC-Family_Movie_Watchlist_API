import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'Chave123';

export function authenticate(req, res, next){
    const autor = req.headers.authorization;

    if(!autor || !autor.startsWith("Bearer ")){
        return res.status(401).json({ "error": "No token provided." });
    }

    const token = autor.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ "error": "Invalid or expired token." });
    }
    
}