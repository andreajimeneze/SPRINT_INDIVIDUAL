import express from "express";
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export class Compra {
  constructor(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos) {
    this.fecha = new Date().toLocaleDateString();;
    this.monto_neto = monto_neto;
    this.id_usuario = id_usuario;
    this.impuesto = impuesto;
    this.monto_bruto = monto_bruto;
    this.gasto_envio = gasto_envio;
    this.productos = productos;
  
  }

  // REALIZAR COMPRA
  async realizarCompra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos) {
    try {
      const respuesta = await fetch('http://localhost:4000/api/v1/compra', {
        method: 'POST',
        body: JSON.stringify({
          compra: {
            fecha,
            monto_neto,
            id_usuario,
            impuesto,
            monto_bruto,
            gasto_envio
          },
          productos
        }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      const datos = await respuesta.json();
  
      return datos;
    } catch (error) {
      console.log(error);
      console.log('No se pudo realizar la compra');
    }
  }

  // OBTENER COMPRA POR ID
  async getCompraById(id) {
   
    const result = await fetch(`http://localhost:4000/api/v1/compra/${id}`)
    const data = await result.json();

    const item = data[0]

    if (item) {
      return new Compra(
        item.id,
        item.monto_neto,
        item.id_usuario,
        item.impuesto,
        item.monto_bruto,
        item.gasto_envio,
      );
    } else {
      console.log(`Compra ${id} no existe`)
    }
  } catch(e) {
    console.log(e, 'Error al procesar la búsqueda')
  }
}

