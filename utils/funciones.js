import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export function verificarToken(token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
           console.log('El token no es válido');
            // return res.redirect('/ingreso');
            return { success: false }
        } else {
            // usuario = req.session.user;
                return { success: true }
        }
    })
}