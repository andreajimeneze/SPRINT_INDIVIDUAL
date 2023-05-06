export const capFirstMay = function (str) {
   
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export const formatCL = function (num) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        useGrouping: true,
    }).format(num);
}

export const monedaANumero = function(valor) {
    const numero = parseFloat(valor.replace(/[^\d.-]/g, ''));
    return isNaN(numero) ? 0 : numero * 1000;
  }
  

export const eq = function(a, b) {
    return a === b
}
