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

// export function requireAuth(req, res, next) {
//   if (req.session && req.session.user) {
//     // Si el usuario está autenticado, guardamos la información del usuario en la sesión
//     const usuario = req.session.user.nombres;
//     // res.locals.user = req.session.user;
//     return usuario;
//   }
//   next();
// }