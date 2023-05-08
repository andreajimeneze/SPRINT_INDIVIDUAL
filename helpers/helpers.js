// HELPER PARA PONER MAYÚSCULA EN PRIMERA LETRA
export const capFirstMay = function (str) {
   
    return str.charAt(0).toUpperCase() + str.slice(1)
}

// HELPER PARA CONVERTIR NÚMERO EN MONEDA NACIONAL
export const formatCL = function (num) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        useGrouping: true,
    }).format(num);
}

// HELPER PARA CONVERTIR MONEDA NACIONAL EN NÚMERO
export const monedaANumero = function(valor) {
    const numero = parseFloat(valor.replace(/[^\d.-]/g, ''));
    return isNaN(numero) ? 0 : numero * 1000;
  }
  
// HELPER PARA COMPARAR Y RETORNAR VALORES IGUALES. SE USA EN EL HBS PAGE1 PARA ANIDAR UN GROUP BY DENTRO DE CATEGORÍAS
export const eq = function(a, b) {
    return a === b
}
