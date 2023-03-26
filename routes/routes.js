import express from "express";
import fs from "fs";
import productos from "../index.js";
import users from "../index.js";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

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

router.post("/ingreso", (req, res) => {
    
  let { nombres, apellidos, rut, direccion, telefono, email, usuario1 } = req.body;
  let users = JSON.parse(fs.readFileSync("./data/users.json"));
  users.push({ nombres, apellidos, rut, direccion, telefono, email, usuario1 })
  let user = JSON.stringify(users);

  fs.writeFileSync("./data/users.json", user);

  let { usuario, correo } = req.body;
  let regisUsers = JSON.parse(fs.readFileSync("./data/users.json"));
  console.log(regisUsers[0].usuario)
  if((regisUsers.usuario|| regisUsers.email) == req.body ) {
    console.log("usuario correcto")
  } else { console.log("usuario no existe")}

  res.send("formulario enviado con éxito");
})


export default router;