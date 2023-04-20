// import pool from "../../conect.js";
// import { Producto } from "../Class/Producto.js";

export class Canasta {
  constructor() {
    this.items = [];
    this.total = 0;
  }

  async addPdto(pdto, cant) {
    const productoExistente = this.items.find(item => item.id === pdto.id);

    if (productoExistente) {
      productoExistente.cant += cant;
      productoExistente.subtotal = productoExistente.precio * productoExistente.cant;
    } else {
      const producto = { ...pdto, cant, subtotal: pdto.precio * cant };
      this.items.push(producto);
    }
  }

  // OTRA FORMA DE ELIMINAR PRODUCTO DE CARRO
  // deletePdtoCart(id) {
  //   const pdtosCarro = this.items.filter(item => item.id !== id)

  //   this.items = pdtosCarro;
  // }
  agregarCant(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    const itemPdto = this.items.find(item => item.id == id)
    if (itemIndex !== -1) {
      this.items[itemIndex].cant += 1;
      itemPdto.subtotal = itemPdto.cant * itemPdto.precio;
    }
  }

  eliminarCant(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    const itemPdto = this.items.find(item => item.id == id)
    if (itemIndex !== -1) {
      if (this.items[itemIndex].cant > 1) {
        this.items[itemIndex].cant += -1;
        itemPdto.subtotal = itemPdto.cant * itemPdto.precio;

      }
      this.calcTotalPdto(1)
    }
  }

  deletePdtoCart(id) {
    const index = this.items.findIndex(items => items.id == id)

    this.items.splice(index, 1)
    return this.items;

  }

  vaciarCarro() {
    this.items = [];
    console.log(this.items)
  }

  calcTotalPdto(subtotal) {
    let total = 0;
    for (let i = 0; i < this.items.length; i++) {

      total += this.items[i].subtotal;
    }
    console.log(total)
    return total;
  }

  // CALCULAR TOTAL CON IMPUESTOS (IVA)
  // calcTotal(subtotal) {
  //   const impuestos = subtotal * 0.18;
  //   return subtotal + impuestos;
  // }

  // CALCULAR COSTOS DE ENVÍO
  //   calcEnvio(total) {
  //     let envio;
  //     if (total <= 50000) {
  //       envio = 3500;
  //       return envio
  //     } else if (total > 50000) {
  //       envio = 9990;
  //       return envio
  //     }
  //   }
}