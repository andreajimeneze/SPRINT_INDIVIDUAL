import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

// VERIFICACIÓN DEL TOKEN ADMINISTRADOR
export const verificarTokenAdmin = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
      req.flash('error', 'No tienes autorización para acceder a esta página');
      return res.redirect('/ingreso');
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err || decoded.rol_id !== 1) { 
        console.log(decoded.rol_id)
        req.flash('error', 'No tienes permiso para acceder a esta página');
        return res.redirect('/ingreso');
      }
      next(); 
    });
  };

