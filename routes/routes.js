import express from "express";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import { Producto } from "../utils/Class/Producto.js";
import { Usuario } from "../utils/Class/Usuario.js";
import { Canasta } from "../utils/Class/Canasta.js";
import { Categoria } from "../utils/Class/Categoria.js";
import { formatCL, capFirstMay } from "../helpers/helpers.js";
import methodOverride from "method-override";
// import CryptoJS from "crypto-js";
import dotenv from 'dotenv';

// Variables globales
const router = express.Router();
const secreto = "secreto";
const cart = new Canasta();
const pdto = new Producto();
const user = new Usuario();
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
// CARGAR TIENDA CON PRODUCTOS (JOIN CON TABLA CATEGORÍA)
router.get("/tienda", async (_req, res) => {
  const productos = await pdto.getProductsByCategory()

  res.render("tienda", { productos })
})

// VISTA PRODUCTOS POR CATEGORÍA
router.get("/productos", async (req, res) => {
  const cat_id = parseInt(req.query.categoria);
  const prod = await pdto.getProductByCategory(cat_id);

  res.render("tienda", { prod: prod })
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

  // let user = new Usuario();
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
  // const user = new Usuario();
  const newUsuario = await user.setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario1, pass)
  if (newUsuario == true) {
    res.redirect("ingreso")
  } else {
    req.flash('error2', 'rut o nombre de usuario ya existen.');
    res.redirect("ingreso")
  }
});

// VISTA DE LA CANASTA RENDERIZADA
router.get("/cart", (req, res) => {
  req.session.cart = cart;
  const canasta = cart.items;
  res.render("cart", { products: cart.items, subtotal: formatCL(cart.subtotal), canasta: canasta, total: formatCL(cart.calcTotalPdto()) });
});

// AGREGAR PRODUCTOS A LA CANASTA
router.post("/cart", async (req, res) => {
  const pdtoId = parseInt(req.body.btnAdd);
  const prod = await pdto.getProductById(pdtoId);
  await cart.addPdto(prod, 1);
  req.session.cart = cart;
  const canasta = cart.items;
  res.render("cart", { products: cart.items, subtotal: formatCL(cart.subtotal), canasta: canasta, total: formatCL(cart.calcTotalPdto()) });
});

// ACTUALIZAR CANTIDAD PDTOS EN CANASTA (MÉTODO CLASS CANASTA CALCULA SUBTOTALES). ASIMISMO SE EJECUTA EL MÉTODO CALCULAR TOTALES AL RENDERIZAR LA PÁGINA CART.
router.post('/cart/updateCant', (req, res) => {
  const pdtoId = parseInt(req.body.addOne);
  const prodId = parseInt(req.body.btnMinus)
  cart.agregarCant(pdtoId);
  cart.eliminarCant(prodId)
  req.session.cart = cart;
  const canasta = cart.items;
  res.render('cart', { products: cart.items, subtotal: formatCL(cart.subtotal), canasta: canasta, total: formatCL(cart.calcTotalPdto()) });
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
  req.session.cart = cart;
  const canasta = cart.items;
  res.render("cart", { products: cart.items, subtotal: formatCL(cart.subtotal), canasta: canasta, total: formatCL(cart.calcTotalPdto()) });
})

router.post("/cart/subtotal", (req, res) => {
  const prize = req.body.prize;
  const cant = req.body.cantProd;
  const subtotal = cart.calcSubtotalPdto(prize, cant)
  res.render("cart", { subtotal: formatCL(subtotal) })
})


/*--------------------------------M A N T E N E D O R ---------------------------------------*/

// DEFINIR CATEGORÍAS SELECT MANTENEDOR AGREGAR PRODUCTO
router.get("/sesionadm", async (req, res) => {
  const cat = new Categoria();
  const categorias = await cat.getCategoria()
  res.render("sesionadm", { categorias: categorias })
})

// AGREGAR NUEVO PRODUCTO DESDE MANTENEDOR
router.post("/adm", async (req, res) => {
  const { namePdto, prizePdto, imgPdto, cantPdto, categ } = req.body;
  await pdto.addPdto(namePdto, parseInt(prizePdto), imgPdto, parseInt(cantPdto), parseInt(categ))

  res.redirect("tienda");
})


// OBTENER PRODUCTOS PARA MANTENEDOR ELIMINAR
router.get("/delete", async (_req, res) => {
  const prod = await pdto.getProductsByCategory()

  res.render("admin", { prod })
})

// OBTENER PRODUCTOS PARA MANTENEDOR MODIFICAR
router.get("/modif", async (_req, res) => {

  const prod = await pdto.getProductsByCategory()

  res.render("modifPdto", { prod })
})

// ELIMINAR PRODUCTO DESDE MANTENEDOR
router.delete("/adm/:id", async (req, res) => {
  const pdtoEliminar = parseInt(req.params.id);

  await pdto.deletePdto(pdtoEliminar)
  res.redirect("../tienda")
})

//MODIFICAR PRODUCTO DESDE MANTENEDOR
router.put("/modpdto/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const prize = parseInt(req.body.prize);
  const link = req.body.link;
  const stock = parseInt(req.body.stock);
  const categoria = req.body.categoria;
  const cat = new Categoria()
  const categEnc = await cat.getCategoria()
  const cat_id = categEnc.find(item => item.id == id)


  await pdto.modifPdto(name, prize, link, stock, cat_id, id)
  res.redirect("/sesionadm");
})

// ACCEDER A MODIFICARPDTO.HBS
router.get("/modpdto", (_req, res) => {
  res.render("modificarPdto")
})

// CARGAR PRODUCTOS EN MANTENEDOR
router.get("/modpdto/form", async (_req, res) => {

  const prod = await pdto.getProducts()

  res.render("modificarPdto", { prod })
})

// SESIÓN ADMIN --- SE INGRESA CON USERNAME Y PASSWORD
router.get("/sesionadm", (_req, res) => {
  res.render("sesionadm")
})



export default router;