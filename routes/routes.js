import express from "express";
import fs from "fs";
import connection from "../conect.js";
import session from "express-session";
import { Producto } from "../utils/Class/Producto.js";
import { Usuario } from "../utils/Class/Usuario.js";
import { Canasta } from "../utils/Class/Canasta.js";
const router = express.Router();
const cart = new Canasta();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("index")
})

router.get("/tienda", async (req, res) => {
  const pdto = new Producto()
  const productos = await pdto.getProducts()

  res.render("tienda", { productos })
})

router.get("/contacto", (req, res) => {
  res.render("contacto")
})

router.get("/ingreso", (req, res) => {
  res.render("ingreso")
})

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/ingreso.hbs'));
});

router.get('/cart', (req, res) => {
  res.render("cart");
})

router.post('/auth', async (req, res) => {
  let username = req.body.usuario;
  let password = req.body.password;

  let user = new Usuario();

  const usuario = await user.getUsuario(username, password)

  if (usuario.success) {
    req.session.loggedin = true;
    req.session.username = usuario.usuario;
    res.redirect('/cart');
  } else {
    res.redirect('/ingreso')
  }
}
);


router.post("/ingreso", (req, res) => {
  const { nombres, apellidos, rut, direccion, telefono, email, usuario1, pass } = req.body;

  const user = new Usuario();
  user.setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario1, pass)

  res.redirect("/ingreso")
});

router.get("/cart", (req, res) => {
  const cart = req.session.cart || new Canasta();
  res.render("cart", { products: cart.items, total: cart.total });
});


router.post("/cart", async (req, res) => {
  const pdtoId = parseInt(req.body.btnAdd);
  
  const producto = new Producto()
  const prod = await producto.getProductById(pdtoId);
  await cart.addPdto(prod, 1);
  req.session.cart = cart;
  const canasta = cart.items;
  res.render("cart", { products: cart.items, total: cart.total, canasta: canasta });
});

router.delete("/cart", (req, res) => {
  const vaciar = parseInt(req.body.vaciar);
  cart.vaciarCarro()
  res.render("cart");
})

router.delete("/cart", (req, res) => {
  const trash = parseInt(req.body.trash);
  cart.deletePdto(trash)
  res.render("cart");
})

export default router;