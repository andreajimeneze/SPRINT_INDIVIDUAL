import pool from "../../conect.js";
// import { Canasta } from "../Class/Canasta.js";

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

            consulta.rows.forEach(rows => {
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

            if (!item) {
                throw error(`Producto ${id} no existe`)
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

    async getProductByName(name) {

        try {
            const consulta = await pool.query('SELECT * FROM producto WHERE nombre = $1', [name]);

            const item = consulta.rows[0]

            if (!item) {
                throw error(`Producto ${name} no existe`)
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

    async addPdto(nombre, precio, img, exist) {
        const pdto = new Producto()
        const bdpdtos = await pdto.getProducts()
        let pdtoExist = bdpdtos.find((e) => e.nombre == nombre)

        if (!pdtoExist) {
            const consulta = await pool.query("INSERT INTO producto (nombre, precio, imagen, existencia) VALUES ($1, $2, $3, $4)", [nombre, precio, img, exist]);
            return consulta.rows[0]
        } else {
            console.log("Producto ya existe en la Base de Datos")
            return null
        }
    }

    async deletePdto(id) {
        try {
            const consulta = await pool.query("DELETE from producto WHERE id = $1 RETURNING *", [id])
            console.log(consulta.rows[0])

        } catch (e) {
            throw e;
        }
    }

    async modifPdto(nombre, precio, imagen, existencia, id) {
        try {
            const cons = await pool.query("UPDATE producto SET nombre = $1, precio = $2, imagen = $3, existencia = $4 WHERE id = $5 RETURNING *", [nombre, precio, imagen, existencia, id])
            console.table(cons.rows[0]);
        } catch (e) {
            console.log(e)
        }

    }
}
