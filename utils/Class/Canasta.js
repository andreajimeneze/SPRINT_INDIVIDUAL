// import pool from "../../conect.js";
// import { Producto } from "../Class/Producto.js";

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

  // OTRA FORMA DE ELIMINAR PRODUCTO DE CARRO
  // deletePdtoCart(id) {
  //   const pdtosCarro = this.items.filter(item => item.id !== id)

  //   this.items = pdtosCarro;
  // }

  deletePdtoCart(id) {
    const index = this.items.findIndex(items => items.id == id)

    this.items.splice(index, 1)
    return this.items;

  }

  vaciarCarro() {
    this.items = [];
    console.log(this.items)
  }

  // calcSubtPdto() {
       
  //  }
  // }

  // calcSubtotal() {

  // }

  // calcImpuesto() {

  // }

  // calcEnvio() {

  // }

  // calcTotal() {

  // }

}