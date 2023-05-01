import express from "express";
import flash from "express-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Producto } from "../utils/Class/Producto.js";
import { Usuario } from "../utils/Class/Usuario.js";
import { Canasta } from "../utils/Class/Canasta.js";
import { Categoria } from "../utils/Class/Categoria.js";
import { Estado } from "../utils/Class/Estado.js";
import { Compra } from "../utils/Class/Compra.js";
import { formatCL, capFirstMay } from "../helpers/helpers.js";
// import { validarToken } from "../utils/funciones.js";
import methodOverride from "method-override";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
import { TRUE } from "node-sass";
// import morgan from "morgan";
dotenv.config();

// Variables globales
const router = express.Router();
const cart = new Canasta();
const pdto = new Producto();
const user = new Usuario();
const cat = new Categoria();


// Métodos de Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method", { methods: ["GET", "POST"] }));
// router.use(morgan('dev'));
router.use(cookieParser());
router.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Cambiar a true para HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 día
  }
}))

router.use(flash({
  flashMessageOptions: {
    timeout: 5000
  }
}))

/* -------------------------- C A R G A   D E   P R O D U C T O S ------------------------------*/

// VISTA INDEX (LINK CATEGORÍAS CON GROUP BY)
router.get("/", async (_req, res) => {
  const categ = await cat.getCategorias()
  const cantCat = await pdto.getCantPdtoCateg();
  
  res.render("index", { categ, cantidad: cantCat })
})

// CARGAR TIENDA CON PRODUCTOS (JOIN CON TABLA CATEGORÍA)
router.get("/tienda", async (_req, res) => {
  const productos = await pdto.getProductsByCategory();
  
  res.render("tienda", { productos })
})

// VISTA PRODUCTOS POR CATEGORÍA --- EN INDEX (LINK DE CATEGORÍAS CON GROUP BY)
router.get("/productos", async (req, res) => {
  const cat_id = parseInt(req.query.categoria);
  const prod = await pdto.getProductByCategory(cat_id);
  const categ = await cat.getCategorias()
  const cantCat = await pdto.getCantPdtoCateg();

  res.render("tienda", { prod: prod, categ, cantidad: cantCat })
})

// ORDER BY PRECIO EN TIENDA --- NO ESTÁ FUNCIONANDO
// router.get("/productos/minprecio", async (req, res) => {
//   const minPrize = req.body.minPrize
//   console.log(minPrize)
//   const product = await pdto.getPdtosByPrize(minPrize)
//   res.render("tienda", { product })
// })
/* ---------------------------------- C O N T A C T 0  -----------------------------------------*/
// VISTA CONTACTO
router.get("/contacto", (_req, res) => {
  res.render("contacto")
})


/* ------------------- I N G R E S O  Y  R E G I S T R O  D E  U S U A R I O --------------------*/

// VISTA INGRESO CON MENSAJE ERROR #IF
router.get('/ingreso', (req, res) => {
  const msjError = req.flash("error");
  const msjError2 = req.flash("error2");
  const msjeError3 = req.flash("error3")
  res.render("ingreso", { msjError, msjError2, msjeError3 })
});

// ACCEDER A SESIÓN CON USUARIO Y PASSWORD, EN CASO DE SER ADMINISTRADOR SE GUARDA TOKEN EN LA COOKIE Y SE REDIRECCIONA A SESIONADMIN. EN CASO DE SER SÓLO USUARIO, SE REDIRIGE A LA TIENDA Y EN CASO DE CONTRASEÑA SE QUEDA EN INGRESO

router.post('/auth', async (req, res, next) => {
  const usuario = req.body.usuario;
  const password = CryptoJS.SHA256(req.body.password).toString();
  try {
    const resultado = await user.getUsuarios(usuario, password);

    if (resultado.success) {
      req.session.user = resultado.user;
      const userName = resultado.user.usuario;
      const userRol = resultado.user.rol_id;
      
      if (userRol === 1) {
       
        res.cookie('token', resultado.token, { httpOnly: true });
        res.redirect('/sesionadm');
      } else {
        // res.cookie(userName);
        // console.log(userName)
        // res.render('tienda', { user: userName })
        res.redirect('tienda')
      }
    } else {
      req.flash('error', resultado.message);
      res.redirect('/ingreso');
    }
  } catch (error) {
    req.flash('error', 'Ocurrió un error en la base de datos');
    res.redirect('/ingreso');
  }
});

// SE VERIFICA EL TOKEN Y EN EL CASO DEL ADMINISTRADOR SE DIRIGE A SESIONADM, EN CASO DE OTROS USUARIOS SE REDIRIGE A TIENDA
router.get('/sesionadm', (req, res) => {

  const token = req.cookies.token;

  if (!token) {
    req.flash('error', 'No tienes permiso para acceder a esta página');
    return res.redirect('/ingreso');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      req.flash('error', 'El token no es válido');
      return res.redirect('/ingreso');
    }

    const usuario = req.session.user;
    
    res.render('sesionadm', {
      user: usuario.usuario,
      message: 'Usuario administrador',
    });
  });
});


// SE CIERRA LA SESIÓN DEL USUARIO
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('token');
  res.redirect('/tienda');
});



// REGISTRAR NUEVO USUARIO
router.post("/ingreso", async (req, res) => {
  const { nombres, apellidos, rut, direccion, telefono, email, usuario1, pass } = req.body;
  const rol = 2;

  const newUsuario = await user.setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario1, pass, rol)
  console.log(newUsuario)
  if (newUsuario === true) {
    res.redirect("ingreso")
  } else {
    req.flash('error2', 'rut o nombre de usuario ya existen.');
    res.redirect("ingreso")
  }
});


/*-----------------------------C A N A S T A   D E  C O M P R A S -------------------------------*/

//VISTA RENDERIZADA DE LA CANASTA
router.get("/cart", (req, res) => {
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render("cart", { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });
});

// AGREGAR PRODUCTOS A LA CANASTA
router.post("/cart", async (req, res) => {
  const pdtoId = parseInt(req.body.btnAdd);
  const prod = await pdto.getProductById(pdtoId);
  const pdtoAgregado = cart.addPdto(prod, 1);
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  //   if(pdtoAgregado) { 
  //   await addProducto(prod)
  // }
  res.render("cart", { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });

});

// router.use((req, res, next) => {
//   res.locals.numItems = req.session.cart ? req.session.cart.length : 0;
//   next();
// });

// router.get('/cart/updateCant', (req, res) => {
//   res.render('cart/updateCant')
// })
// ACTUALIZAR CANTIDAD PDTOS EN CANASTA (MÉTODO CLASS CANASTA CALCULA SUBTOTALES). ASIMISMO SE EJECUTA EL MÉTODO CALCULAR TOTALES AL RENDERIZAR LA PÁGINA CART.
router.post('/cart/updateCant', (req, res) => {
  const pdtoId = parseInt(req.body.addOne);
  const prodId = parseInt(req.body.btnMinus)
  cart.agregarCant(pdtoId);
  cart.eliminarCant(prodId)
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render("cart", { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });

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
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render("cart", { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });

})


/*-------------------------F O R M A L I Z A C I Ó N  D E  C O M P R A S-------------------------*/

// AGREGAR COMPRA A BASE DE DATOS
// router.post("/compra", async (req, res) => {
//   const fecha = new Date().toLocaleDateString();
//   const totalFinal = req.body.compras;
//   const id_usuario = null;
//   const compra = new Compra()
// console.log(fecha)
// console.log(id_usuario)
// console.log(totalFinal)
//   const compraRealizada = await compra.realizarCompra(fecha, totalFinal, id_usuario)
//   // console.log(compraRealizada)
//   res.redirect("tienda")
// })

// AGREGAR DETALLE COMPRA A BASE DE DATOS
// router.post("/detalle", (req, res) => {
//   const { idPdto, cantPdto, precioPdto } = req.body
// })


/*-------------------------------M A N T E N E D O R --------------------------------*/

// DEFINIR CATEGORÍAS SELECT MANTENEDOR AGREGAR PRODUCTO
router.get("/sesionadm", async (req, res) => {
  const cat = new Categoria();
  const categorias = await cat.getCategoria()
  res.render("sesionadm", { categorias: categorias })
})



// AGREGAR NUEVO PRODUCTO DESDE MANTENEDOR
router.post("/adm", async (req, res) => {
  const { namePdto, prizePdto, imgPdto, cantPdto, categ } = req.body;
  try {
    const data = await pdto.addPdto(namePdto, parseInt(prizePdto), imgPdto, parseInt(cantPdto), parseInt(categ))
    res.redirect("tienda");
  } catch (e) {
    res.render("error", { "error": "Problemas al Insertar registro" });
  }
})


// OBTENER PRODUCTOS PARA MANTENEDOR ELIMINAR
router.get("/delete", async (_req, res) => {
  const prod = await pdto.getPdtosEstado()

  res.render("admin", { prod })
})

// OBTENER PRODUCTOS PARA MANTENEDOR MODIFICAR
router.get("/modif", async (_req, res) => {

  const prod = await pdto.getPdtosEstado()
  const est = new Estado()
  const estado = await est.getEstados()

  res.render("modifPdto", { prod, estado: estado })
})

// ELIMINAR PRODUCTO DESDE MANTENEDOR
router.delete("/adm/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const data = await pdto.deletePdto(id)
  res.redirect("/delete")
})

//MODIFICAR PRODUCTO DESDE MANTENEDOR
router.put("/modpdto/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const name = req.body.name;
  const prize = parseInt(req.body.prize);
  const link = req.body.link;
  const stock = parseInt(req.body.stock);
  const categoria = req.body.categoria;
  const estado = req.body.estado;
  const cat = new Categoria()
  const categEnc = await cat.getCategoria()
  const cat_id = categEnc.find(item => item.id == id)


  await pdto.modifPdto(name, prize, link, stock, cat_id, estado, id)
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

// router.get("/otro", (req, res) => {
//   res.render("otro")
// })

export default router;