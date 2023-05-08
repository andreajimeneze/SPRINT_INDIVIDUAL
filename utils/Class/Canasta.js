
export class Canasta {
  constructor() {
    this.items = [];
    this.total = 0;
    this.subtotal = 0;
    this.iva = 0;
    this.envio = 0;
  }

  // MÉTODO PARA AGREGAR PRODUCTOS AL CARRO DE COMPRAS
  addPdto(pdto, cant) {
    const productoExistente = this.items.find(item => item.id === pdto.id);

    if (productoExistente) {
      productoExistente.cant += cant;
      productoExistente.subtotal = productoExistente.precio * productoExistente.cant;
    } else {
      const producto = { ...pdto, cant, subtotal: pdto.precio * cant };
      this.items.push(producto);
    }
  }

  // SE UTILIZA PARA AUMENTAR EN 1 LA CANTIDAD DE UN PRODUCTO
  agregarCant(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    const itemPdto = this.items.find(item => item.id == id)
    if (itemIndex !== -1) {
      this.items[itemIndex].cant += 1;
      itemPdto.subtotal = itemPdto.cant * itemPdto.precio;
    }
  }

  // SE UTILIZA PARA DISMINUIR EN 1 LA CANTIDAD DE UN PRODUCTO
  eliminarCant(id) {
    const itemIndex = this.items.findIndex(item => item.id === id);
    const itemPdto = this.items.find(item => item.id == id)
    if (itemIndex !== -1) {
      if (this.items[itemIndex].cant > 1) {
        this.items[itemIndex].cant += -1;
        itemPdto.subtotal = itemPdto.cant * itemPdto.precio;

      }
      this.calcTotal(1)
    }
  }

  // SE UTILIZA PARA ELIMINAR EL PRODUCTO SELECCIONADO EN EL CARRO DE COMPRAS
  deletePdtoCart(id) {
    const index = this.items.findIndex(items => items.id == id)

    this.items.splice(index, 1)
    return this.items;

  }

  // SE UTILIZA PARA VACIAR EL CARRO DE COMPRAS
  vaciarCarro() {
    this.items = [];
  }

// CALCULAR SUBTOTAL
calcTotal() {
  let totalBruto = 0;
  for (let i = 0; i < this.items.length; i++) {
    totalBruto += this.items[i].precio * this.items[i].cant;
  }
  return totalBruto;
}

// CALCULAR TOTAL CON IMPUESTOS Y ENVÍO
calcTotalFinal() {
  const totalBruto = this.calcTotal();
  const impuestos = this.calcImpuesto(totalBruto);
  const totalNeto = totalBruto - impuestos;
  const envio = this.calcEnvio(totalBruto);
  const totalFinal = parseInt(totalBruto) + parseInt(envio);
  return totalFinal;
}

// CALCULAR IVA
  calcImpuesto(totalBruto) {
    const impuestos = totalBruto * 0.19;
  
    return impuestos;
  }

  // CALCULAR COSTOS DE ENVÍO
    calcEnvio(totalBruto) {
      let envio;
      if (totalBruto <= 50000) {
        envio = 3500;
        return envio;
      } else if (totalBruto > 50000) {
        envio = 9990;
        return envio;
      } else {
        envio = 0;
        return envio;
      }
    }
}