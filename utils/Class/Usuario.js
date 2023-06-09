import jwt from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();

export class Usuario {
    constructor(usuario, password) {
        this.nombres = '';
        this.apellidos = '';
        this.rut = '';
        this.direccion = '';
        this.telefono = '';
        this.email = '';
        this.usuario = usuario;
        // this.password = CryptoJS.SHA256(password).toString();
        this.password = password;
        this.rol_id = '';
    }

    async getUsuarios(usuario, password) {
        try {
          const resultado = await fetch('http://localhost:4000/api/v1/usuario')
          const data = await resultado.json();

          let index = data.findIndex((e) => e.usuario === usuario)
          const userExist = data[index];
          
          if (userExist) {
            if (userExist.password === password) {
              return { success: true, user: userExist, userRol: userExist.rol_id, message: 'Usuario con credenciales' };
            } else {
              return { success: false, message: 'Nombre de usuario o contraseña incorrectos' };
            }
          } else {
            return { success: false, message: 'Usuario no existe' };
          }
        } catch (err) {
          return { message: 'Ocurrió un error en la base de datos' };
        }
      }
      


    async getUsuario(id) {
        try {
            const resultado = await fetch(`http://localhost:4000/api/v1/usuario/${id}`)
            const data = await resultado.json()
            const item = data[0]

            if (item) {
                return {
                    id: item.id,
                    nombres: item.nombres,
                    apellidos: item.apellidos,
                    direccion: item.direccion,
                    usuario: item.usuario,
                    rol: item.rol_id
                }
            }
        } catch (error) {
            return { message: 'Ocurrió un error en la base de datos' };
        }
    }

    async setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario, password, rol_id) {
        try {
            const user = new Usuario()
            const userName = await user.getUsuarios(usuario, password)
          console.log(userName)
            if (!userName.success) {

                const resultado = await fetch('http://localhost:4000/api/v1/usuario', {
                    method: 'POST',
                    body: JSON.stringify({ 
                        nombres, 
                        apellidos, 
                        rut, 
                        direccion, 
                        telefono, 
                        email, 
                        usuario, 
                        password, 
                        rol_id }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'aplication/json'
                    }
                });
                return true;
            } else {
                console.log('Usuario y/o rut ya existen')
            }
        } catch (error) {
            console.log(error)
        }
    }


}
