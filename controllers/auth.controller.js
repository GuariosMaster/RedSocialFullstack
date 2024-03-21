import {User} from "../models/User.js"
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import { tokenVerificationErrors } from "../utils/tokenManager.js";


export const register = async (req, res) => {
    const { fullName, email, password, age } = req.body;
    try {
        //Alternativa buscando por email
        let userOne = await User.findOne({ email });
        if(userOne) throw ({code: 11000});

        const user = new User({ fullName, email, password, age });

        await user.save();

        // Generar y enviar el token JWT si es necesario

        return res.status(201).json({ ok: true });
    } catch (error) {
        console.log(error.code);
        //Alternativa por defecto mongoose
        if(error.code === 11000){
            return res.status(400).json({ error: 'Ya existe el usuario' });
        }
        return res.status(500).json({ error: "Error en el servidor" })
    }
};

export const login = async (req, res) => {
   try {
    const { email, password } = req.body;
    let userOne = await User.findOne({ email });
    if(!userOne) return res.status(400).json({ error: "No existe este usuario" })

    const respuestaPassword = await userOne.comparePassword(password)
    if(!respuestaPassword){
        return res.status(403).json({ error: "Contraseña incorrecta"})
    }
    //Generar el Token JWT
    const {token, expiresIn} = generateToken(userOne.id)
    
    generateRefreshToken(userOne.id, res)
    return res.json({ token, expiresIn });

   } catch (error) {
    console.log(error.code);
    return res.status(500).json({ error: "Error en el servidor" })
   }
}

export const infoUser = async(req, res) => {
   try {
    const user = await User.findById(req.uid).lean()
    return res.json({ email: user.email, uid: user._id });
   } catch (error) {
    return res.status(500).json({error: "Error de el server"})
   }
}

export const refreshToken = (req, res) => {
    try {
        const {token, expiresIn} = generateToken(req.uid);
        return res.json({ token, expiresIn });
        
    } catch (error) {
        console.log(error.message)

       return res.status(401).send({error: tokenVerificationErrors[error.message]});
    }
}

export const logout = (req, res) => {
    const cookies = req.cookies;
    for (const cookieName in cookies) {
        res.clearCookie(cookieName);
    }
    // Responder con un mensaje de éxito
    res.json({ message: "Todas las cookies han sido eliminadas" });
}

