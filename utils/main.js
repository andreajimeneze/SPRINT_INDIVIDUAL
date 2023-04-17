// CALCULAR TOTAL DE LA COMPRA
export function calcularSubtotal(productos) {
    let subtotal = 0;
    for (let i = 0; i < productos.length; i++) {
      subtotal += productos[i].precio;
    }
    return subtotal;
  }
  
  // CALCULAR TOTAL CON IMPUESTOS (IVA)
  export function calcularTotal(subtotal) {
    const impuestos = subtotal * 0.18; 
    return subtotal + impuestos;
  }

// CALCULAR COSTOS DE ENVÍO
export function calcularCostoEnvio(total) {
    let envio;
if(total <= 50000) {
    envio = 3500;
    return envio
} else if(total > 50000) {
    envio = 9990;
    return envio
}
}
  
  // CÁLCULO SUBTOTAL Y TOTAL
  const subtotal = calcularSubtotal(productos);
  const total = calcularTotal(subtotal) + calcularCostoEnvio(total);