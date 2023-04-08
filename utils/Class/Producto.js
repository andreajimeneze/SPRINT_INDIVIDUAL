import pool from "../../conect.js";

export class Producto {
    constructor(id, nombre, precio, foto, existencia) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
        this.existencia = existencia;
    }


    async getProducts() {
        let dataPdto = [];
        try {
            const consulta = await pool.query('SELECT * FROM producto');

            consulta.rows.map(rows => {
                dataPdto.push({
                    id: rows.id,
                    nombre: rows.nombre,
                    precio: rows.precio,
                    imagen: rows.imagen,
                    existencia: rows.existencia
                });
            })
            
            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    async getProductById(id) {
       
        try {
            const consulta = await pool.query('SELECT * FROM producto WHERE id = $1', [id]);
            
            const item = consulta.rows[0]
            
            if(!item) { 
                throw error(`Producto ${ id } no existe`)
            }
            return new Producto(                
                    item.id,
                    item.nombre,
                    item.precio,
                    item.imagen,
                    item.existencia
                );
        } catch (e) {
            throw e;
        }
    }
    
}