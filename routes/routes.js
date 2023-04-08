import express from "express";
import fs from "fs";
import connection from "../conect.js";
import session from "express-session";
import { Producto } from "../utils/Class/Producto.js";
import { Usuario } from "../utils/Class/Usuario.js";
import { Canasta } from "../utils/Class/Canasta.js";
const router = express.Router();

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


// router.get("/cart", (req, res) => {
//   res.render("cart");
// })

router.get("/cart", (req, res) => {
  const cart = req.session.cart || new Canasta();
  res.render("cart", { products: cart.items, total: cart.total });
});


router.post("/cart", async (req, res) => {
  const pdto = req.body.btnAdd;
  const cant = 1;
  console.log(pdto)
  const cart = req.session.cart ||new Canasta();
  const newProduct = new Producto()
  await cart.addPdto(pdto, cant);
  const pdtoAgreg = await newProduct.getProductById(pdto)
  
  console.log(`Pdto ${ pdtoAgreg.nombre } se agregó exitosamente`)
 
  res.render("cart", { products: cart.items, total: cart.total })
  
})

// router.get("/cart/decrease", (req, res) => {
//   res.render("cart");
// })

// router.put("/cart/drecrease", (req, res) => {
//   const prodId = req.body.btnMinus
//   const cart =  req.session.cart || new Canasta()
//   // const pdto = new Producto()
//   // const pdtoMinus = pdto.getProductById(prodId)
//   const remove = cart.reduceCant(prodId)
//   console.log(remove)
//   res.render("cart");
// })

// router.post("/cart/increase", (req, res) => {
//   const prodId = req.body.btnAdd
//   const cart = new Canasta()
//   const add = cart.addCant(prodId)
//   console.log(add)
//   res.render("cart");
// })

export default router;