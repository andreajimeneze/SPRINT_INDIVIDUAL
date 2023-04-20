import express from "express";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import { Producto } from "../utils/Class/Producto.js";
import { Usuario } from "../utils/Class/Usuario.js";
import { Canasta } from "../utils/Class/Canasta.js";
import { formatCL, capFirstMay } from "../helpers/helpers.js";
import methodOverride from "method-override";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

// Variables globales
const router = express.Router();
const secreto = "secreto";
const cart = new Canasta();
dotenv.config();

// Métodos de Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));
router.use(cookieParser(secreto));
router.use(session({
  secret: secreto,
  resave: true,
  saveUninitialized: false,
  maxAge: 60000
}))
router.use(flash({
  flashMessageOptions: {
    timeout: 5000
  }
}))


// VISTA INDEX
router.get("/", (_req, res) => {
  res.render("index")
})
// CARGAR TIENDA CON PRODUCTOS
router.get("/tienda", async (_req, res) => {
  const pdto = new Producto()
  const productos = await pdto.getProducts()

  res.render("tienda", { productos })
})

// VISTA CONTACTO
router.get("/contacto", (_req, res) => {
  res.render("contacto")
})

// VISTA INGRESO CON MENSAJE ERROR #IF
router.get('/ingreso', (req, res) => {
  const msjError = req.flash("error");
  const msjError2 = req.flash("error2");
  const msjeError3 = req.flash("error3")
  res.render("ingreso", { msjError, msjError2, msjeError3 })
});

// ACCEDER A SESIÓN CON USUARIO Y PASSWORD
router.post('/auth', async (req, res) => {
  let username = req.body.usuario;
  let password = req.body.password;

  let user = new Usuario();
  const usuario = await user.getUsuario(username, password)

  if (usuario.success) {
    if (username == process.env.ADM_USUARIO) {
      res.redirect('/sesionadm');
    } else {
      res.redirect('/tienda');
    }
  } else {
    req.flash('error', 'Usuario y/o contraseña incorrectas');
    res.redirect("ingreso");
  }
}
);

// REGISTRAR NUEVO USUARIO
router.post("/ingreso", async (req, res) => {
  const { nombres, apellidos, rut, direccion, telefono, email, usuario1, pass } = req.body;

  const user = new Usuario();

  const newUsuario = await user.setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario1, pass)
  if (newUsuario == true) {
    res.redirect("ingreso")
  } else {
    req.flash('error2', 'rut o nombre de usuario ya existen.');
    res.redirect("ingreso")
  }
});

router.get("/cart", (req, res) => {
  const cart = req.session.cart || new Canasta();
  const canasta = cart.items;
  res.render("cart", { products: cart.items, total: cart.total, canasta: canasta, total: cart.calcTotalPdto() });
});

// AGREGAR PRODUCTOS A LA CANASTA
router.post("/cart", async (req, res) => {
  const pdtoId = parseInt(req.body.btnAdd);

  const producto = new Producto()
  const prod = await producto.getProductById(pdtoId);
  await cart.addPdto(prod, 1);
  req.session.cart = cart;
  const canasta = cart.items;
  res.render("cart", { products: cart.items, total: cart.total, canasta: canasta, total: cart.calcTotalPdto()  });
});

// ACTUALIZAR CANTIDAD PDTOS EN CANASTA (MÉTODO CLASS CANASTA CALCULA SUBTOTALES). ASIMISMO SE EJECUTA EL MÉTODO CALCULAR TOTALES AL RENDERIZAR LA PÁGINA CART.
router.post('/cart/updateCant', (req, res) => {
  const pdtoId = parseInt(req.body.addOne);
  const prodId = parseInt(req.body.btnMinus)
  cart.agregarCant(pdtoId);
  cart.eliminarCant(prodId)
  req.session.cart = cart;
  const canasta = cart.items;
  res.render('cart', { products: cart.items, subtotal: cart.subtotal, canasta: canasta, total: cart.calcTotalPdto() });
});


// VACIAR CANASTA
router.delete("/cart", (_req, res) => {
  cart.vaciarCarro()
  res.render("cart");
})

// ELIMINAR UN PRODUCTO DE LA CANASTA
router.delete("/cart/:id", (req, res) => {
  const id = parseInt(req.params.id);
  cart.deletePdtoCart(id)
  const canasta = cart.items;

  res.render("cart", { canasta });
})

router.post("/cart/subtotal", (req, res) => {
  const prize = req.body.prize;
  console.log(prize)
  const cant = req.body.cantProd;
  console.log(cant)
  const subtotal = cart.calcSubtotalPdto(prize, cant)
  res.render("cart", { subtotal })
})




/*-----------------------------------M A N T E N E D O R ---------------------------------------*/

// AGREGAR NUEVO PRODUCTO DESDE MANTENEDOR
router.post("/adm", async (req, res) => {
  const { namePdto, prizePdto, imgPdto, cantPdto } = req.body;
  let pdto = new Producto()
  await pdto.addPdto(namePdto, parseInt(prizePdto), imgPdto, parseInt(cantPdto))

  res.redirect("tienda");
})


// OBTENER PRODUCTOS PARA MANTENEDOR ELIMINAR
router.get("/delete", async (_req, res) => {
  const pdto = new Producto()
  const prod = await pdto.getProducts()

  res.render("admin", { prod })
})

// OBTENER PRODUCTOS PARA MANTENEDOR MODIFICAR
router.get("/modif", async (_req, res) => {
  const pdto = new Producto()
  const prod = await pdto.getProducts()

  res.render("modifPdto", { prod })
})

// ELIMINAR PRODUCTO DESDE MANTENEDOR
router.delete("/adm/:id", async (req, res) => {
  const pdtoEliminar = parseInt(req.params.id);
  let pdto = new Producto()
  await pdto.deletePdto(pdtoEliminar)
  res.redirect("../tienda")
})

//MODIFICAR PRODUCTO DESDE MANTENEDOR
router.put("/modpdto/:id", async (req, res) => {
  const id = parseInt(req.params.id)
  const name = req.body.name
  const prize = parseInt(req.body.prize)
  const link = req.body.link
  const stock = parseInt(req.body.stock)

  let pdto = new Producto()
  await pdto.modifPdto(name, prize, link, stock, id)
  res.redirect("/sesionadm");
})

// ACCEDER A MODIFICARPDTO.HBS
router.get("/modpdto", (_req, res) => {
  res.render("modificarPdto")
})

// CARGAR PRODUCTOS EN MANTENEDOR
router.get("/modpdto/form", async (_req, res) => {
  const pdto = new Producto()
  const prod = await pdto.getProducts()

  res.render("modificarPdto", { prod })
})

// SESIÓN ADMIN --- SE INGRESA CON USERNAME Y PASSWORD
router.get("/sesionadm", (_req, res) => {
  res.render("sesionadm")
})



export default router;