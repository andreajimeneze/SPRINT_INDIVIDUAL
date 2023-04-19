import pool from "../../conect.js";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

dotenv.config();


export class Usuario {
    constructor(usuario, password) {
        this.nombres = '';
        this.apellidos = '';
        this.rut = '';
        this.direccion = '';
        this.telefono = '';
        this.email = '';
        this.usuario = '';
        this.password = CryptoJS.SHA256(password).toString();
    }

    async setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario, password) {
        try {
            const resul = await pool.query(`INSERT INTO registrousuario (nombres, apellidos, rut, direccion, telefono, email, usuario, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`, [nombres, apellidos, rut, direccion, telefono, email, usuario, CryptoJS.SHA256(password).toString()])
            console.log(`Usuario ${resul.rows[0].usuario} registrado con éxito`)
            return true;
        } catch (e) {
            if (e.constraint === 'unique_usuario') {
                console.log("usuario ya existe")
                return false;
            } else if (e.constraint === "unique_rut") {
                console.log("usuario ya está registrado")
                return false;
            }
        } 
    }

    async getUsuario(usuario, password) {
        try {
            const res = await pool.query('SELECT * FROM registrousuario where usuario = $1 and password = $2', [usuario, CryptoJS.SHA256(password).toString()])
            if (res.rows.length === 0) {
                return { success: false, message: 'Nombre de usuario o contraseña incorrectos' };
            } else {
                this.usuario = usuario;
                this.password = CryptoJS.SHA256(password).toString();
                return {
                    success: true,
                    usuario: res.rows[0].usuario
                }
            }
        } catch (err) {
            return { success: false, message: 'Ocurrió un error en la base de datos' };
        }
    }

}
