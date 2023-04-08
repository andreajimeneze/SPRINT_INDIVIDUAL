import pool from "../../conect.js";
import CryptoJS from "crypto-js";

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
        }
        catch (e) {
            throw e;
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

    async login() {
        try {
          return { success: true };
        } catch (err) {
          return { success: false, message: 'Ocurrió un error durante la autenticación' };
        }
      }
    }

