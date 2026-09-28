import { findByUsername, getWatchlist, addMovie, updateMovie, deleteMovie } from './utils/db.js';
import { authenticate } from './middleware/authenticate.js';
import { authorizeModification } from './middleware/authorize.js';
import jwt from 'jsonwebtoken';
import express from "express";

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "Chave123";
const PORT = process.env.PORT || 3000;

app.use(express.json());


app.get("/api/watchlist/:userId", authenticate, (req,res) => {
    const userId = Number(req.params.userId);
    const lista = getWatchlist(userId);
    return res.status(200).json(lista);
})

app.post("/api/watchlist/:userId/movies", authenticate, authorizeModification, (req,res) => {
    const userId = Number(req.params.userId);
    const filme = addMovie(userId, req.body);
    console.log(filme);
    return res.status(201).json(filme);
})

app.put("/api/watchlist/:userId/movies/:movieId", authenticate, authorizeModification,  (req,res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const filme = updateMovie(userId, movieId, req.body);
    console.log(filme);
    return res.status(200).json(filme);
})

app.delete("/api/watchlist/:userId/movies/:movieId", authenticate, authorizeModification, (req,res) => {
    const userId = Number(req.params.userId);
    const movieId = Number(req.params.movieId);
    const filme = deleteMovie(userId, movieId, req.body);
    console.log(filme);
    return res.status(200).json({ message: "Movie removed" });
})


app.post("/api/auth/login",(req, res)=>{
    const username = req.body.username;
    const password = req.body.password;

    if(!username || !password){
        return res.status(400).json({ "error": "Username and password are required."});
    }
    const usuario = findByUsername(username);
    if( usuario === null || usuario._password != password){
        return res.status(401).json({"error": "Invalid Username or Password"});
    }
    const payload = { id: usuario.id, username: usuario.username, role: usuario.role };
    const token = jwt.sign(payload, JWT_SECRET);
    return res.status(200).json({ "token": token });
})


app.listen(PORT, () => {
    console.log("Server no Ar");
});