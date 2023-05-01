import express from "express";
const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

export class Compra {
    constructor() {
        this.fecha = new Date().toLocaleDateString();;
        this.monto = 0;
        this.id_usuario = null;
    }

    async realizarCompra(fecha, monto, id_usuario) {
        try {
            const resultado = await fetch("http://localhost:4000/api/v1/compra", {
                method: "POST",
                body: JSON.stringify({ fecha, monto, id_usuario }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "aplication/json"
                }
            });

            const datos = await fetch("http://localhost:4000/api/v1/compra");
            const data = await datos.json();
        } catch (error) {
           console.log(error)
        }
    }

}