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

    async getUsuario(usuario, password) {
        try {
            const resultado = await fetch("http://localhost:4000/API/v1/usuario")
            let userExist = resultado.rows.find((e) => e.usuario == usuario)
            console.log(userExist)
           
            if (userExist) {
                this.usuario = usuario;
                this.password = CryptoJS.SHA256(password).toString();
                return {
                    success: true,
                    usuario: res.rows[0].usuario
                }
            } else {
                return { success: false, message: 'Nombre de usuario o contraseña incorrectos' };
            }
        } catch (err) {
            return { message: 'Ocurrió un error en la base de datos' };
        }
    }


    async setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario, password) {
        try {
            const user = new Usuario()
            const usuario = user.getUsuario(usuario)
            if(usuario) { 
            const resultado = await fetch("http://localhost:4000/API/v1/usuario", {
                method: "POST",
                body: JSON.stringify({ nombres, apellidos, rut, direccion, telefono, email, usuario, password }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "aplication/json"
                }
            });
           
            return true;
        } else {
            console.log("Usuario y/o rut ya existen")
        }
        } catch (error) {
            return res.status(500).json({
                message: "Algo salió mal. Intente más tarde"
            });
        } 
    }

    
}
