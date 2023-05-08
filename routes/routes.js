import express from "express";
import methodOverride from "method-override";
import CryptoJS from "crypto-js";
import dotenv from "dotenv";
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
import { Empresa } from "../utils/Class/Empresa.js";
import { formatCL, capFirstMay, monedaANumero } from "../helpers/helpers.js";
import { verificarTokenAdmin } from "../utils/funciones.js";
import { generarFactura } from "../utils/pdf.js";

dotenv.config();

// Variables globales
const router = express.Router();
const cart = new Canasta();
const pdto = new Producto();
const user = new Usuario();
const cat = new Categoria();
const est = new Estado();
let usuario;


// Métodos de Middlewares
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(methodOverride("_method", { methods: ["GET", "POST"] }));
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


/* ------------------------ C A R G A   D E   P R O D U C T O S --------------------------*/

// VISTA INDEX (LINK CATEGORÍAS CON GROUP BY)
router.get('/', async (req, res) => {
  const categ = await cat.getCategorias()
  const cantCat = await pdto.getCantPdtoCateg();

  res.render('index', { categ, cantidad: cantCat })
})

// CARGAR TIENDA CON PRODUCTOS (JOIN CON TABLA CATEGORÍA)
router.get('/tienda', async (req, res) => {

  const productos = await pdto.getProductsByCategory();

  res.render('tienda', { productos })
})

//ORDER BY EN TIENDA
router.get('/tienda/:num', async (req, res) => {
  const { num } = req.params
  const productos = await pdto.ordenarPor(num);

  res.render('tienda', { productos })
})

// VISTA PRODUCTOS POR CATEGORÍA --- EN INDEX (LINK DE CATEGORÍAS CON GROUP BY)
router.get('/productos', async (req, res) => {
  const cat_id = parseInt(req.query.categoria);
  const prod = await pdto.getProductByCategory(cat_id);
  const categ = await cat.getCategorias()
  const cantCat = await pdto.getCantPdtoCateg();

  res.render('tienda', { prod: prod, categ, cantidad: cantCat })
})


/* --------------- C O N T A C T 0  Y  N O S O T R O S -----------------*/
// VISTA CONTACTO
router.get('/contacto', (_req, res) => {
  res.render('contacto')
})

// VISTA NOSOTROS 
router.get('/nosotros', (_req, res) => {
  res.render('nosotros')
})


/* ----------- I N G R E S O  Y  R E G I S T R O  D E  U S U A R I O -------------*/

// VISTA INGRESO CON MENSAJE ERROR #IF
router.get('/ingreso', (req, res) => {
  const msjError = req.flash('error');
  res.render('ingreso', { msjError })
});

// ACCEDER A SESIÓN CON USUARIO Y PASSWORD, EN CASO DE SER ADMINISTRADOR SE GUARDA TOKEN EN LA COOKIE Y SE REDIRECCIONA A SESIONADMIN. EN CASO DE SER SÓLO USUARIO, SE REDIRIGE A LA TIENDA Y EN CASO DE CONTRASEÑA SE QUEDA EN INGRESO

router.post('/auth', async (req, res, next) => {
  const usuario = req.body.usuario;
  const password = CryptoJS.SHA256(req.body.password).toString();

  try {
    const resultado = await user.getUsuarios(usuario, password);

    if (resultado.success) {
      req.session.user = resultado.user;
      const userRol = resultado.user.rol_id;
      const userName = resultado.user.nombres;

      const token = jwt.sign({ user: resultado.user.id, userName: userName, rol_id: userRol }, process.env.JWT_SECRET);
      res.cookie('token', token, { httpOnly: true });

      if (userRol === 1) {
        res.redirect('sesionadm');
      } else {
        res.redirect('tienda');
      }
    } else {
      req.flash('error', resultado.message);
      res.redirect('ingreso');
    }
  } catch (error) {
    req.flash('error', 'Ocurrió un error en la base de datos');
    res.redirect('ingreso');
  }
});


router.get('/sesionadm', verificarTokenAdmin, async (req, res) => {
  usuario = req.session.user.nombres;
  res.render('sesionadm', {
    user: usuario,
    message: 'Usuario administrador',
  });
});

// RUTA PARA QUE SE CARGUE DIV CON EL USUARIO LOGUEADO (NO FUNCIONA)
router.get('/', async (req, res) => {
  const usuario = req.body.usuario;
  const password = CryptoJS.SHA256(req.body.password).toString();

  const resultado = await user.getUsuarios(usuario, password);
  if (resultado.success) {
    req.session.user = resultado.user;
    const userName = req.session.user.nombres;
    
    res.render('index', { userName })
  }
});


// SE CIERRA LA SESIÓN DEL USUARIO
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('token');
  res.redirect('/tienda');
});



// REGISTRAR NUEVO USUARIO
router.post('/ingreso', async (req, res) => {
  const { nombres, apellidos, rut, direccion, telefono, email, usuario1, pass } = req.body;
  const rol = 2;

  const newUsuario = await user.setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario1, pass, rol)

  if (newUsuario === true) {
    res.redirect('ingreso')
  } else {
    req.flash('error2', 'rut o nombre de usuario ya existen.');
    res.redirect('ingreso')
  }
});


/*-----------------------------C A N A S T A   D E  C O M P R A S -------------------------------*/

//VISTA RENDERIZADA DE LA CANASTA
router.get('/cart', (req, res) => {
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });
});

// AGREGAR PRODUCTOS A LA CANASTA
router.post('/cart', async (req, res) => {
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

  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });

});


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
  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });

});

// VACIAR CANASTA
router.delete('/cart', (_req, res) => {
  cart.vaciarCarro()
  res.render('cart');
})

// ELIMINAR UN PRODUCTO DE LA CANASTA
router.delete('/cart/:id', (req, res) => {
  const id = parseInt(req.params.id);
  cart.deletePdtoCart(id)
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal) });

})


/*-------------F O R M A L I Z A C I Ó N  D E  C O M P R A S-------------*/

// FORMALIZAR COMPRA POR TRANSACCIÓN 
router.post('/compra', async (req, res) => {
  const fecha = new Date().toLocaleDateString();
  const monto_neto = monedaANumero(req.body.monto_neto);
  const impuesto = monedaANumero(req.body.impuesto);
  const monto_bruto = monedaANumero(req.body.monto_bruto);
  const gasto_envio = monedaANumero(req.body.gasto_envio);
  const id_usuario = req.session.user ? req.session.user.id : req.body.usuario || 0;
  
  const productos = req.body.productos.map(p => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad
  }));

  const compra = new Compra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos)

  const compraRealizada = await compra.realizarCompra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos)
  
  const empresa = new Empresa();
  const datosEmpresa = await empresa.getDatosEmpresa();
  
  // const doc = new PDFDocument()

  const docGenerado = await generarFactura(compra, datosEmpresa);
 

  // Enviar el archivo PDF como respuesta
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=factura.pdf');

  docGenerado.pipe(res)
  // doc.on('finish', function () {
  //   res.redirect('tienda');
  });
   // res.redirect('tienda')


// router.post('/compra', async (req, res) => {
//   const compras = {  
//    fecha: new Date().toLocaleDateString(),
//   monto_neto: monedaANumero(req.body.monto_neto),
//   impuesto: monedaANumero(req.body.impuesto),
//    monto_bruto: monedaANumero(req.body.monto_bruto),
//   gasto_envio: monedaANumero(req.body.gasto_envio)
//   }
//   const id_usuario = req.session.user ? req.session.user.id : req.body.usuario || 0;

//   // Mapear los productos para obtener un arreglo de objetos con los campos deseados
//   const productos = req.body.productos.map(p => ({
//     id: p.id,
//     nombre: p.nombre,
//     precio: p.precio,
//     cantidad: p.cantidad
//   }));

//   // Crear una nueva instancia de la clase Compra
//   const compra = new Compra();

//   // Realizar la compra utilizando el método `realizarCompra` de la instancia de Compra
//   const compraRealizada = await compra.realizarCompra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos);

//   // Obtener los datos de la empresa utilizando una nueva instancia de la clase Empresa
//   const empresa = new Empresa();
//   const datosEmpresa = await empresa.getDatosEmpresa();

//   const doc = new PDFDocument()
//   // Generar el PDF de la factura utilizando la función `generarFactura`
//   await generarFactura(compras, productos, datosEmpresa);

//   // Enviar el archivo PDF como respuesta
//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', `attachment; filename=factura_${compras.id}.pdf`);

//   // Se utiliza doc.pipe para enviar el PDF al cliente
//   doc.pipe(res);

//   doc.on('finish', function() {
//     res.redirect('tienda');
//   });
//   doc.end();
// });

// router.post('/compra', async (req, res) => {
//   // const compras = {
//     const fecha = new Date().toLocaleDateString();
//     const monto_neto = monedaANumero(req.body.monto_neto);
//     const impuesto = monedaANumero(req.body.impuesto);
//     const monto_bruto = monedaANumero(req.body.monto_bruto);
//     const gasto_envio = monedaANumero(req.body.gasto_envio)
//   // };
//   console.log(compras)
//   const id_usuario = req.session.user ? req.session.user.id : req.body.usuario || 0;
// console.log(id_usuario)
//   // Mapear los productos para obtener un arreglo de objetos con los campos deseados
//   const productos = req.body.productos.map(p => ({
//     id: p.id,
//     nombre: p.nombre,
//     precio: p.precio,
//     cantidad: p.cantidad
//   }));
// console.log(productos)
//   // Crear una nueva instancia de la clase Compra
//   const compra = new Compra();

//   try {
//     // Realizar la compra y generar el PDF de la factura utilizando la función `generarFactura`
//     const compraRealizada = await compra.realizarCompra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos);

//     const empresa = new Empresa();
//     const datosEmpresa = await empresa.getDatosEmpresa();

// //     const pdfStream = await generarFactura(compras, productos, datosEmpresa);
// // console.log(pdfStream)
// //     // Establecer los encabezados para enviar el archivo PDF al cliente
// //     res.setHeader('Content-Type', 'application/pdf');
// //     res.setHeader('Content-Disposition', `attachment; filename=factura_${compraRealizada}.pdf`);

// //     // Enviar los datos del PDF al cliente
// //     pdfStream.pipe(res);

//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Error al realizar la compra');
//   }
// });

/*-------------------------------M A N T E N E D O R --------------------------------*/

// OBTENER SELECT PARA ESTADOS Y CATEGORÍAS EN MANTENEDOR AGREGAR PRODUCTO EN VISTA PROTEGIDA
router.get('/add', verificarTokenAdmin, async (req, res) => {
  try {
    usuario = req.session.user.nombres;

    const categ = await cat.getCategorias();
    const estado = await est.getEstados();

    res.render('addPdto', {
      categ: categ, estado: estado,
      user: usuario
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ha ocurrido un error');
  }

})

// AGREGAR NUEVO PRODUCTO DESDE MANTENEDOR
router.post('/adm', async (req, res) => {
  const { namePdto, prizePdto, imgPdto, cantPdto, categoria, estado } = req.body;
  try {
    const data = await pdto.addPdto(capFirstMay(namePdto), parseInt(prizePdto), imgPdto, parseInt(cantPdto), parseInt(categoria), parseInt(estado))
    res.redirect('tienda');
  } catch (e) {
    res.render('error', { 'error': 'Problemas al Insertar registro' });
  }
})


// OBTENER PRODUCTOS PARA MANTENEDOR ELIMINAR EN VISTA PROTEGIDA
router.get('/delete', verificarTokenAdmin, async (req, res) => {
  usuario = req.session.user.nombres;
  const prod = await pdto.getPdtosEstado()

  res.render('eliminarPdto', { prod: prod, user: usuario })
})

// ELIMINAR PRODUCTO DESDE MANTENEDOR
router.delete('/adm/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  const data = await pdto.deletePdto(id)
  res.redirect('/delete')
})

// OBTENER PRODUCTOS PARA MANTENEDOR MODIFICAR EN VISTA PROTEGIDA
router.get('/modif', verificarTokenAdmin, async (req, res) => {
  usuario = req.session.user.nombres;
  const prod = await pdto.getPdtosEstado()
  const categ = await cat.getCategorias();
  const estados = await est.getEstados();

  res.render('./modifPdto', { prod: prod, categ: categ, estados: estados, user: usuario })
})

//MODIFICAR PRODUCTO DESDE MANTENEDOR
router.patch('/modpdto/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const nombre = req.body.nombre;
  const precio = parseInt(req.body.precio);
  const imagen = req.body.imagen;
  const existencia = parseInt(req.body.existencia);
  const categoria_id = parseInt(req.body.categoria_id);
  const id_estado = parseInt(req.body.id_estado);

  await pdto.modifPdto(nombre, precio, imagen, existencia, categoria_id, id_estado, id)
  res.redirect('/modif');
})

export default router;