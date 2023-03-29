import express from "express";
import fs from "fs";
import productos from "../index.js";
import connection from "../conect.js";
import session from "express-session";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.render("index")
})

router.get("/tienda", (req, res) => {
  let dataPdto = productos.productos.map(d => {
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

router.get('/', function(req, res) {
	// Render login template
	response.sendFile(path.join(__dirname + '/ingreso.hbs'));
});

router.post('/auth', function(request, response) {
	let username = request.body.usuario;
	let password = request.body.password;
	if (username && password) {
		
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			
			if (error) throw error;
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				response.send('Acceso exitoso');
			} else {
				response.send('Clave y/o usuario incorrecto');
			}			
			response.end();
		});
	} else {
		response.send('Por favor, ingrese usuario y clave');
		response.end();
	}
});

connection.query(`SELECT * from accounts`,function (error, results, fields) {
  if(error)
  throw error;
  results.forEach(result => {
  });

});

router.post("/ingreso", (req, res) => {
  connection.query(`INSERT INTO registro (nombres, apellidos, rut, direccion, telefono, email, usuario ) VALUES ("${req.body.nombres}", "${req.body.apellidos}", "${req.body.rut}", "${req.body.direccion}", "${req.body.telefono}", "${req.body.email}", "${req.body.usuario1}")`, function (error, results, fields) {
    if(error)
    throw error;
      console.log(results);
      res.redirect("/ingreso")
  });
});

// router.get("/cart", (req, res) => {
// res.render("cart");
// })

// router.get('/tienda', (req, res) => {
//   const productId = req.query.productId;
//   const product = getProductById(productId);

//   if (product) {
//     const cart = req.session.cart || {};
//     const cartProduct = cart[productId];

//     if (cartProduct) {
//       // Si el producto ya está en el carrito, incrementa su cantidad
//       let cantProd = parseInt(req.query.cantProd)
//       cartProduct.cantProd += product.cantProd;
//     } else {
//       // Si el producto no está en el carrito, agrégalo con una cantidad inicial de 1
//       cart[productId] = {
//         id: productId,
//         name: product.nombre,
//         price: product.precio,
//         quantity: cantProd
//       };
//     }

//     req.session.cart = cart;
//   }

//   res.redirect('/cart');
// });



// router.get("/tienda", (req, res) => {
//   let addPdto = req.query.btnAdd;
//  console.log(addPdto)
//   if (addPdto) {
//     let prod = req.query.pdtoId;
//     let cart = req.session.cart || {};
//     if (prod) {
//       if (cart[prod]) {
//         cart[prod].cantProd++;
//       } else {
//         cart[prod] = {
//           id: prod,
//           nombre: prod.nombre,
//           precio: prod.precio,
//           cantProd: prod.cantidad
//         };
//       }
//       req.session.cart = cart;
//     }
//   }
//   res.redirect("/cart");
// });

export default router;