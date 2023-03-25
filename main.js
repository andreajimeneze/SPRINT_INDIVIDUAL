// Data productos




// Carga de productos en index.html
var cardProductos = document.querySelector(".contenedor");
var listaProductos = "";
cardProductos.classList.add("d-flex", "wrap", "p-2");


// Función para modificar cantidad de productos en cada card.
function modificarCantidad(btn, Id) {
    var cantidadCarrito = Number(document.querySelector(`#cantX_${Id}`).textContent);
    cantidadCarrito = cantidadCarrito + btn;

    if (cantidadCarrito > 0) {
        document.querySelector(`#cantX_${Id}`).textContent = cantidadCarrito;
    } else {
        cantidadCarrito = 1;
    }
};

// Función para modificar cantidad en canasta de compras

function variarCantidad(btnCanasta, Id) {
    let cantidadCanasta = Number(document.querySelector(`#cantCanasta_${Id}`).textContent);
    let cantidadActual = ParseInt(cantidadCanasta.textContent);
    let nuevaCantidad = cantidadActual + btnCanasta;

    if (nuevaCantidad >= 1) {
       cantidadActual.innerHTML = nuevaCantidad; 
    } 
};


// Agregar cantidad productos al carro.
var dataCanasta = [];
var precios = [];
             
function actualizarCanasta() {
        let datosProductosAComprar = document.querySelector(".datosProductosAComprar");
        var renderCarrito = "";
        
    dataCanasta.map((d, Id) => {
        var cantidad = Number(document.querySelector(`#cantX_${d.Id}`).textContent);
        

        renderCarrito = renderCarrito +
            `<tr "class="filaTabla" onchange="calcularTotales()">
                    <td>Código ${d.Id}</td>
                    <td ><img src="${d.foto}" alt="" id="fotoCarrito"></td>
                    <td>${d.nombre}</td>
                    <td id="precioPdto_${d.Id}">$ ${d.precio}</td>
                    <td><div class="d-flex column justify-content-center" id="tarjeta-modificarCarro">
                        <button class="btnAddCarro" value=btnCanasta id="btnCarro_${d.Id} onclick="variarCantidad(-1, ${d.Id})">-</button>
                        <p class="mb-0 mt-0 align-self:center" id="cantCanasta_${d.Id}">${cantidad}</p>
                        <button class="btnAddCarro" value=btnCanasta id="btnCarro_${d.Id} onclick="variarCantidad(1, ${d.Id})">+</button></td>
                    <td class="subtotalPdto_${d.Id}"> ${d.precio * cantidad}</td>
                    <td><a></a><img src="./assets/img/trash-svgrepo-com.svg" alt="" onclick="removePdto(${Id})"></a></td>
                </tr>`;       
    });
    datosProductosAComprar.innerHTML = renderCarrito;    
};


function agregarProducto(Id) {
    let cant = Number(document.querySelector(`#cantX_${Id}`).textContent);
    console.log(cant);
    let pdto = productos.find(d => d.Id == Id)
    let nuevoPdto = pdto;
    precios.push(pdto.precio * cant);
    console.log(precios);
    nuevoPdto = dataCanasta.push(pdto);
    actualizarCanasta();
    calcularTotales()
};

// Cálculo de valores finales de la compra
function calcularTotales() {
    var calculoFinal = document.querySelector(".valoresTotales");
            
    var valoresFinales = "";
    var subtotalNeto = 0;
    const porcIva = 0.19;
    var iva = 0; 
    
    let totalCarrito = 0;
    if (dataCanasta == 0) {
       totalCarrito = 0;
       precios = [];
    } else {
        precios.forEach(d => 
            totalCarrito += d
        ) 
    
        subtotalNeto += totalCarrito;
       iva = Math.round(subtotalNeto / porcIva/ 100);
    
         valoresFinales = valoresFinales +
            `<div class="preciosCarrito" >Subtotal Neto
            <span>$ ${totalCarrito - iva}</span>
            </div>
            <div class="preciosCarrito">IVA
            <span>$ ${iva}</span>
            </div>
            <div class="preciosCarrito">Total a pagar
            <span>$ ${totalCarrito}</span>
            </div>`;           
       
     calculoFinal.innerHTML = valoresFinales;
    actualizarCanasta();     
}
};

// Remover producto de la canasta
function removePdto(index) {
    dataCanasta.find(d => d.index == index);
    let pdtoRemove = dataCanasta.splice(index, 1); 
    
    dataCanasta.filter(d => {
        d.index !== pdtoRemove; 
    })

    precios.find(d => d.index == index);
    let precioRemove = precios.splice(index,1);
    precios.filter(index => {
        index !== precioRemove;
        console.log(precios);
        calcularTotales()
    })

    if (dataCanasta == 0) {
        precios.length = 0;
    }

    actualizarCanasta();
    calcularTotales()  
};    

// Vaciar carro de compras
function vaciarCarrito() {
    if (dataCanasta.length > 0) {
            dataCanasta.length = 0;
            precios.length = 0;

            actualizarCanasta(); 
            calcularTotales() 
    }
};
        

       
    