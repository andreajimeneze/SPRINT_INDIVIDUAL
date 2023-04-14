import express from "express";
import fs from "fs";
import connection from "../conect.js";
import session from "express-session";
import { Producto } from "../utils/Class/Producto.js";
import { Usuario } from "../utils/Class/Usuario.js";
import { Canasta } from "../utils/Class/Canasta.js";
import methodOverride from "method-override";
const router = express.Router();
const cart = new Canasta();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method"));

router.get("/", (req, res) => {
  res.render("index")
})
// CARGAR TIENDA CON PRODUCTOS
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

// ACCEDER A SESIÓN CON USUARIO Y PASSWORD
// router.post('/auth', async (req, res) => {
//   const { usuario, password } = req.body;
//   if (!usuario || !password) {
//     return res.send('Debe completar los campos requeridos');
//   }
//   const userN = new Usuario();
//   const resultado = await userN.getUsuario(usuario, password);
//   if (!resultado.success) {
//     return res.send(resultado.message);
//   }
//   req.session.user = usuario;
//   if (usuario === 'root') {
//     return res.redirect('/adm');
//   } else {
//     return res.redirect('/tienda');
//   }
// });

router.post('/auth', async (req, res) => {
  let username = req.body.usuario;
  let password = req.body.password;

  let user = new Usuario();

  const usuario = await user.getUsuario(username, password)

  if (usuario.success) {
    req.session.loggedin = true;
    req.session.username = usuario.usuario;
    res.redirect('/cart'); }
    else if(username == "root" && password == "1234"){
      res.redirect("/sesionadm")
    } else { res.redirect('/ingreso')
    console.log("contraseña no es correcta")}
  } 
);

// REGISTRAR NUEVO USUARIO
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

// AGREGAR PRODUCTOS A LA CANASTA
router.post("/cart", async (req, res) => {
  const pdtoId = parseInt(req.body.btnAdd);

  const producto = new Producto()
  const prod = await producto.getProductById(pdtoId);
  await cart.addPdto(prod, 1);
  req.session.cart = cart;
  const canasta = cart.items;
  res.render("cart", { products: cart.items, total: cart.total, canasta: canasta });
});

// VACIAR CANASTA
router.delete("/cart", (req, res) => {
  const vaciar = parseInt(req.body.vaciar);
  cart.vaciarCarro()
  res.render("cart");
})

// ELIMINAR UN PRODUCTO DE LA CANASTA
router.delete("/cart", (req, res) => {
  const trash = parseInt(req.body.trash);
  cart.deletePdto(trash)
  res.render("cart");
})

/*MANTENEDOR -----------------------------------------------------------------*/

// AGREGAR NUEVO PRODUCTO DESDE MANTENEDOR
router.post("/adm", async (req, res) => {
  const { namePdto, prizePdto, imgPdto, cantPdto } = req.body;
  let pdto = new Producto()
  await pdto.addPdto(namePdto, parseInt(prizePdto), imgPdto, parseInt(cantPdto))

  res.redirect("tienda");
})


// OBTENER PRODUCTOS PARA MANTENEDOR ELIMINAR
router.get("/delete", async (req, res) => {
  const pdto = new Producto()
  const prod = await pdto.getProducts()

  res.render("admin", { prod })
})

// ELIMINAR PRODUCTO DESDE MANTENEDOR
router.delete("/adm/:id", async (req, res) => {
  const pdtoEliminar = parseInt(req.params.id);
  let pdto = new Producto()
  await pdto.deletePdto(pdtoEliminar)
  res.redirect("../tienda")
})

// MODIFICAR PRODUCTO DESDE MANTENEDOR
router.put("/adm/:id", async (req, res) => {

  let pdto = new Producto()
  await pdto.modifPdto()
  res.redirect("../tienda");
})

// ACCEDER A MODIFICARPDTO.HBS
router.get("/modpdto", (req, res) => {
  res.render("modificarPdto")
} )

// CARGAR PRODUCTOS EN MANTENEDOR
router.get("/modpdto/form", async (req, res) => {
  const pdto = new Producto()
  const prod = await pdto.getProducts()

  res.render("modificarPdto", { prod })
})

// SESIÓN ADMIN --- SE INGRESA CON USERNAME Y PASSWORD
router.get("/sesionadm", (req, res) => {
  res.render("sesionAdm")
})

router.get("/add", (req, res) => {
res.render("addPdto")
})

router.get("")
export default router;