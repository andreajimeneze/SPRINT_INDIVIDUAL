import express from "express";
import productos from "../index.js";
const router = express.Router();

router.get("/", (req, res) => {  
    res.render("index")
})

router.get("/tienda", (req, res) => {
  let dataPdto = productos.productos.map(d => {
    console.log(productos.productos)
    return {
      id: d.id,
      nombre: d.nombre,
      precio: d.precio,
      img: d.foto
    }
  })
  
  res.render("tienda", { dataPdto })
})

router.get("/contacto", (req, res) => {
  res.render("contacto")
})

router.get("/ingreso", (req, res) => {
  res.render("ingreso")
})


export default router;