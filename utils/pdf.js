import PDFDocument from "pdfkit";
import { formatCL } from "../helpers/helpers.js";

// FUNCIÓN PARA GENERAR ARCHIVO PDF CON LA FACTURA DE COMPRA
export async function generarFactura(compra, datosEmpresa) {
  const doc = new PDFDocument({ size: 'A4' });

  doc.fontSize(18).text(`Factura # ${compra.id}`, {
    width: 410,
    align: 'center'
  });
  doc.moveDown(2);

  for (const propiedad in datosEmpresa[0]) {
    doc.fontSize(14).text(`${datosEmpresa[0][propiedad]}`, { width: 410, align: 'left' });
  }
  doc.moveDown(2);
  doc.fontSize(12).text(`Fecha: ${compra.fecha}`);
  doc.fontSize(12).text(`Cliente: ${compra.id_usuario}`);
  doc.moveDown(2);


  doc.fontSize(16).text('Descripción', {
    width: 410,
    align: 'center'
  });
  doc.moveDown(1);

  // Se utiliza el método forEach para iterar sobre los productos de la compra
  compra.productos.forEach(producto => {
    doc.fontSize(12).text(`Código: ${producto.id}`, {
      width: 500,
      align: 'justify'
    });
    doc.text(`Producto: ${producto.nombre}`)
    doc.text(`Precio unit.: ${formatCL(producto.precio)}`)
    doc.text(`Cantidad: ${producto.cantidad}`)
    doc.moveDown(1);
  });

  console.log(compra.productos)
  doc.moveDown(2);

  doc.fontSize(14).text(`Monto neto: ${formatCL(compra.monto_neto)}`, {
    width: 410,
    align: 'right'
  });
  doc.text(`Impuesto: ${formatCL(compra.impuesto)}`, {
    width: 410,
    align: 'right'
  });
  doc.text(`Monto bruto: ${formatCL(compra.monto_bruto)}`, {
    width: 410,
    align: 'right'
  });
  doc.text(`Gasto envío: ${formatCL(compra.gasto_envio)}`, {
    width: 410,
    align: 'right'
  });
  const total = compra.monto_bruto + compra.gasto_envio;
  doc.text(`Total: ${formatCL(total)}`, {
    width: 410,
    align: 'right'
  });
  console.log(compra)
  doc.end()

  return doc


}


// export async function generarFactura(compra, productos, datosEmpresa) {
//   const doc = new PDFDocument({ size: 'A4' });
//   // doc.registerFont('Helvetica', 'https://fonts.gstatic.com/s/helvetica/v15/1Ptsg8LJRfWJmhDAuUsBRL_vvH9BvtM.ttf');
//   const currentFileUrl = import.meta.url;
//   const currentDirPath = path.dirname(fileURLToPath(import.meta.url));
//   const arialFontPath = path.join(currentDirPath, 'fonts', 'Arial.ttf');
//   doc.font(arialFontPath);

//   doc.fontSize(18).text(`Factura # ${compra.id}`, {
//     width: 410,
//     align: 'center'
//   });
//   doc.moveDown(2);

//   for (const propiedad in datosEmpresa) {
//     doc.fontSize(14).text(`${propiedad}: ${datosEmpresa[propiedad]}`, {
//       width: 410,
//       align: 'left'
//     });
//   }

//   doc.moveDown(2);
//   doc.fontSize(12).text(`Fecha: ${compra.fecha}`);
//   doc.fontSize(12).text(`Cliente: ${compra.id_usuario}`);
//   doc.moveDown(2);

//   doc.fontSize(14).text('Descripción', {
//     width: 410,
//     align: 'center'
//   });
//   doc.moveDown(1);

//   const table = new PDFTable(doc, {
//     bottomMargin: 30
//   });
//   table.addPlugin(new (require('pdfkit-table/plugins/fitcolumn'))({
//     column: 'name'
//   }));
//   table.addPlugin(new (require('pdfkit-table/plugins/striped'))());

//   // Establecer el encabezado de la tabla
//   table
//     .addRow(['Código', 'Descripción', 'Precio', 'Cantidad'])
//     .endHeaders();

//   // Agregar los datos de los productos a la tabla
//   compra.productos.forEach(producto => {
//     table.addRow([producto.id, producto.nombre, `$${producto.precio}`, producto.cantidad]);
//   });

//   // Dibujar la tabla en el documento
//   table.draw(doc, 100, doc.y);
//   doc.moveDown();

//   console.log(compra.productos)
//   doc.moveDown(2);

//   doc.fontSize(14).text(`Monto neto: $ ${compra.monto_neto}`, {
//     width: 410,
//     align: 'right'
//   });
//   doc.text(`Impuesto: $ ${compra.impuesto}`, {
//     width: 410,
//     align: 'right'
//   });
//   doc.text(`Monto bruto: $ ${compra.monto_bruto}`, {
//     width: 410,
//     align: 'right'
//   });
//   doc.text(`Total: $ ${compra.gasto_envio}`, {
//     width: 410,
//     align: 'right'
//   });
//   const total = compra.monto_bruto + compra.gasto_envio;
//   doc.text(`Total: $ ${total}`, {
//     width: 410,
//     align: 'right'
//   });

//   doc.end();
//   return doc;
// }

