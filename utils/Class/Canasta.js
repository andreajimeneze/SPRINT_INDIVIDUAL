import pool from "../../conect.js";
import { Producto } from "../Class/Producto.js";

export class Canasta {
    constructor() {
        this.items = [];
    }

    async addPdto(pdtoId, cant) {
        const consulta = await pool.query('SELECT * FROM producto WHERE id = $1', [pdtoId])
        const prod = consulta.rows[0]

        if (prod.existencia < cant) {
            console.log(`No existen suficientes unidades de ${prod.nombre}`)
        }

        const nuevoPdto = new Producto()
        const pdtoAgregado = await nuevoPdto.getProductById(pdtoId)
        const productoExistente = this.items.find(item => item.id === pdtoAgregado.id);

        if (productoExistente) {
            // Si el producto ya está en la canasta, actualiza la cantidad
            productoExistente.cant += cant;
        } else {
            const producto = { ...pdtoAgregado, cant };
            this.items.push(producto)

            return this.items
        }
    }


    deletePdto(id) {
        const index = this.items.findIndex(item => item.pdto.id === id)

        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
    vaciarCarro() {
        this.items = [];
    }

    // addCant(id) {
    //     const item = this.items.find(item => item.id === id)
        
    //     if (item) {
    //         item.cant++;
            
    //     }
    //     return item;
    // }

    // reduceCant(id) {
    //     const pdto = new Producto()
    //     const pdtoId = pdto.getProductById(id)
    //     const item = this.items.find(item => item.id === pdtoId)

    //     if (item) {
    //         item.cant--;
    //         // cant.textContent += item.cant--
    //     }
    //     return item;
    // }
}