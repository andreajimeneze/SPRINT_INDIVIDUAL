import pool from "../../conect.js";
import { Producto } from "../Class/Producto.js";

export class Canasta {
    constructor() {
        this.items = [];
    }

        async addPdto(pdto, cant) {
        const productoExistente = this.items.find(item => item.id === pdto.id);
      
        if (productoExistente) {
          productoExistente.cant += cant;
        } else {
          const producto = { ...pdto, cant };
          this.items.push(producto);
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

}