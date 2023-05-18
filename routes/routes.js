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
let userRol; 


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
  usuario = req.session.user;
  if( usuario ) {
    userRol = usuario.rol_id;
  } else {
    userRol = 2;
  }
  
  const categ = await cat.getCategorias()
  const cantCat = await pdto.getCantPdtoCateg();

  res.render('index', { categ, cantidad: cantCat, user: usuario, userRol })
})

// CARGAR TIENDA CON PRODUCTOS (JOIN CON TABLA CATEGORÍA)
router.get('/tienda', async (req, res) => {
  usuario = req.session.user;
  if( usuario ) {
    userRol = usuario.rol_id;
  } else {
    userRol = 2;
  }

  const productos = await pdto.getProductsByCategory();

  res.render('tienda', { productos, user: usuario, userRol })
})

//ORDER BY EN TIENDA
router.get('/tienda/:num', async (req, res) => {
  usuario = req.session.user;
  const { num } = req.params
  const productos = await pdto.ordenarPor(num);

  res.render('tienda', { productos, user: usuario })
})

// VISTA PRODUCTOS POR CATEGORÍA --- EN INDEX (LINK DE CATEGORÍAS CON GROUP BY)
router.get('/productos', async (req, res) => {
  usuario = req.session.user;
  const cat_id = parseInt(req.query.categoria);
  const prod = await pdto.getProductByCategory(cat_id);
  const categ = await cat.getCategorias()
  const cantCat = await pdto.getCantPdtoCateg();

  res.render('tienda', { prod: prod, categ, cantidad: cantCat, user: usuario })
})


/* --------------- C O N T A C T 0  Y  N O S O T R O S -----------------*/
// VISTA CONTACTO
router.get('/contacto', (req, res) => {
  usuario = req.session.user;
  if( usuario ) {
    userRol = usuario.rol_id; 
  } else {
    userRol = 2;
  }

  res.render('contacto', { user: usuario, userRol })
})

// VISTA NOSOTROS 
router.get('/nosotros', (req, res) => {
  usuario = req.session.user;
  if( usuario ) {
    userRol = usuario.rol_id;
  } else {
    userRol = 2;
  }
  
  res.render('nosotros', { user: usuario, userRol })
})


/* ----------- I N G R E S O  Y  R E G I S T R O  D E  U S U A R I O -------------*/

// VISTA INGRESO CON MENSAJE ERROR #IF
router.get('/ingreso', (req, res) => {
  usuario = req.session.user;
  const msjError = req.flash('error');
  const msjInfo = req.flash('info');
  res.render('ingreso', { msjError, msjInfo, user: usuario })
});

// ACCEDER A SESIÓN CON USUARIO Y PASSWORD, EN CASO DE SER ADMINISTRADOR SE GUARDA TOKEN EN LA COOKIE Y SE REDIRECCIONA A SESIONADMIN. EN CASO DE SER SÓLO USUARIO, SE REDIRIGE A LA TIENDA Y EN CASO DE CONTRASEÑA SE QUEDA EN INGRESO

router.post('/auth', async (req, res, next) => {
  try {
    const usuario = req.body.usuario;
    const password = CryptoJS.SHA256(req.body.password).toString();
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
      req.flash('error', 'Usuario y/o contraseña incorrectos');
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

// SE CIERRA LA SESIÓN DEL USUARIO
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('token');
  res.redirect('/tienda');
});



// REGISTRAR NUEVO USUARIO
router.post('/ingreso', async (req, res) => {
  const { nombres, apellidos, rut, direccion, telefono, email, usuario1, pass } = req.body;
  const rol = 2; // Desde el registro de usuario sólo pueden registrarse usuarios rol 2

  const newUsuario = await user.setUsuario(nombres, apellidos, rut, direccion, telefono, email, usuario1, pass, rol)

  if (newUsuario === true) {
    req.flash('info', 'Usuario registrado. Puedes ingresar a tu cuenta')
    res.redirect('ingreso')
  } else {
    req.flash('error', 'rut o nombre de usuario ya existen.');
    res.redirect('ingreso')
  }
});


/*-----------------------------C A N A S T A   D E  C O M P R A S -------------------------------*/

//VISTA RENDERIZADA DE LA CANASTA
router.get('/cart', (req, res) => {
  usuario = req.session.user;
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal), user: usuario });
});

// AGREGAR PRODUCTOS A LA CANASTA
router.post('/cart', async (req, res) => {
  usuario = req.session.user;
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

  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal), user: usuario });

});


// ACTUALIZAR CANTIDAD PDTOS EN CANASTA (MÉTODO CLASS CANASTA CALCULA SUBTOTALES). ASIMISMO SE EJECUTA EL MÉTODO CALCULAR TOTALES AL RENDERIZAR LA PÁGINA CART.
router.post('/cart/updateCant', (req, res) => {
  usuario = req.session.user;
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
  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal), user: usuario });

});

// VACIAR CANASTA
router.delete('/cart', (req, res) => {
  usuario = req.session.user;
  cart.vaciarCarro()
  res.render('cart', { user: usuario });
})

// ELIMINAR UN PRODUCTO DE LA CANASTA
router.delete('/cart/:id', (req, res) => {
  usuario = req.session.user;
  const id = parseInt(req.params.id);
  cart.deletePdtoCart(id)
  req.session.cart = cart;
  const canasta = cart.items;
  const totalBruto = cart.calcTotal();
  const iva = cart.calcImpuesto(parseInt(totalBruto));
  const totalNeto = totalBruto - iva;
  const envio = cart.calcEnvio(parseInt(totalBruto));
  const totalFinal = totalBruto + envio;
  res.render('cart', { products: cart.items, totalBruto: formatCL(totalBruto), totalNeto: formatCL(totalNeto), canasta: canasta, iva: formatCL(iva), envio: formatCL(envio), totalFinal: formatCL(totalFinal), user: usuario });

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

  // Se obtiene nombre y apellido del usuario cuando está registrado y se utiliza en la generación de la factura. En caso de que no haya usuario registrado envío id_usuario.
  const usuario = await user.getUsuario(id_usuario)
  let user_name;

  if (req.session.user) {
    user_name = (usuario.nombres + ' ' + usuario.apellidos)
  } else {
    user_name = id_usuario;
  }

  // Se obtienen los productos que se compran para luego utilizarlo en la factura.
  const productos = req.body.productos.map(p => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
    cantidad: p.cantidad
  }));

  // Se ejecuta la transacción de compra.
  const compra = new Compra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos)

  const compraRealizada = await compra.realizarCompra(fecha, monto_neto, id_usuario, impuesto, monto_bruto, gasto_envio, productos)

  // Se obtiene el id de compra y se utiliza como número de factura.
  const compraId = compraRealizada.compraId;
  

  const empresa = new Empresa();
  const datosEmpresa = await empresa.getDatosEmpresa();

  // Se genera la factura con la compra realizada.
  const docGenerado = await generarFactura(user_name, compraId, compra, datosEmpresa);


  // Envia el archivo PDF como respuesta al cliente.
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=factura ${ compraId }.pdf`);

  docGenerado.pipe(res)

});

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