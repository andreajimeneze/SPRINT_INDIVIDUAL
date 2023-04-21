import pool from "../../conect.js";


export class Producto {
    constructor(id, nombre, precio, foto, existencia, categoria_id) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
        this.existencia = existencia;
        this.categoria_id = categoria_id;
    }

    // OBTIENE TODOS LOS PRODUCTOS DE LA TABLA PRODUCTOS
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
                    existencia: rows.existencia,
                    categoria_id: rows.categoria
                });
            })
            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    // OBTIENE TODOS LOS PRODUCTOS (NOMBRE, PRECIO, IMAGEN, EXISTENCIA) DE LA TABLA PRODUCTO Y NOMBRE DE LA CATEGORÍA A LA QUE PERTENECE (JOIN CON TABLA CATEGORÍA)
    async getProductsByCategory() {
        let dataPdto = [];
        
        try {
            const consulta = await pool.query('SELECT p.id, p.nombre, p.precio, p.imagen, p.existencia, p.categoria_id, c.categoria FROM producto p JOIN categoria c ON p.categoria_id = c.id ORDER BY p.id');

            consulta.rows.forEach(rows => {
                dataPdto.push({
                    id: rows.id,
                    nombre: rows.nombre,
                    precio: rows.precio,
                    imagen: rows.imagen,
                    existencia: rows.existencia,
                    categoria_id: rows.categoria_id,
                    categoria: rows.categoria
                });
            })
            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    // OBTIENE EL PRODUCTO  DE LA TABLA PRODUCTO POR SU ID
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

    // OBTIENE PRODUCTO DE LA TABLA PRODUCTO POR SU NOMBRE
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

    // OBTIENE UN PRODUCTO (NOMBRE, CATEGORÍA_ID) CON EL NOMBRE DE LA CATEGORÍA EN BASE A LA ID DE LA CATEGORÍA (JOIN CON TABLA CATEGORÍA)
    
    async getProductByCategory(id) {

        try {
            const consulta = await pool.query('SELECT p.*, c.categoria FROM producto p JOIN categoria c ON p.categoria_id = c.id WHERE c.id = $1', [id]);
            // console.log(consulta.rows[0])

            const items = consulta.rows.map(row => new Producto(row.id, row.nombre, row.precio, row.imagen, row.existencia,  row.categoria));
            return items;
        } catch (e) {
            throw e;
        }
    }

    // AGREGA PRODUCTO NUEVO 
    async addPdto(nombre, precio, img, exist, categ) {
        const pdto = new Producto()
        const bdpdtos = await pdto.getProducts()
        let pdtoExist = bdpdtos.find((e) => e.nombre == nombre)

        if (!pdtoExist) {
            const consulta = await pool.query("INSERT INTO producto (nombre, precio, imagen , existencia, categoria_id) VALUES ($1, $2, $3, $4, $5)", [nombre, precio, img, exist, categ]);
            console.log(consulta.rows[0])
            return consulta.rows[0]
        } else {
            console.log("Producto ya existe en la Base de Datos")
            return null
        }
    }

    // ELIMINAR PRODUCTO
    async deletePdto(id) {
        try {
            const consulta = await pool.query("DELETE from producto WHERE id = $1 RETURNING *", [id])
            console.log(consulta.rows[0])

        } catch (e) {
            throw e;
        }
    }

    // MODIFICAR PRODUCTO
    async modifPdto(nombre, precio, imagen, existencia, categ, id) {
        try {
            const cons = await pool.query("UPDATE producto SET nombre = $1, precio = $2, imagen = $3, existencia = $4, categoria_id = $5 WHERE id = $6 RETURNING *", [nombre, precio, imagen, existencia, categ, id])
            console.table(cons.rows[0]);
        } catch (e) {
            console.log(e)
        }

    }
}
