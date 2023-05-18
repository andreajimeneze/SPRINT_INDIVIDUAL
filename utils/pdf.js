import PDFDocument from "pdfkit";
import { formatCL } from "../helpers/helpers.js";
import fs from "fs";

// FUNCIÓN PARA GENERAR ARCHIVO PDF CON LA FACTURA DE COMPRA
export async function generarFactura(user_name, compraId, compra, datosEmpresa) {
  const doc = new PDFDocument({ size: 'A4', margins: { top: 72, left: 72, right: 150, bottom: 72 } });


  doc.image('./public/assets/img/Logo_Pez_Mosaico.png', {
    fit: [100, 100],
    align: 'center',
    valign: 'top',

    x: 50,
    y: 50
  });

  let xPos = doc.x + doc.image.width + 20;

  for (const propiedad in datosEmpresa[0]) {
    doc.fontSize(12).text(`${datosEmpresa[0][propiedad]}`, {
      width: 450,
      align: 'right',
      valign: 'top',

      x: xPos,
      y: 50
    });
    xPos += 100;
  }

  doc.moveDown(2);

  doc.fontSize(18).text(`Factura # ${compraId}`, {
    width: 450,
    align: 'center'
  });
  
  doc.moveDown(2);
  doc.fontSize(12).text(`Fecha: ${compra.fecha}`);
  doc.fontSize(12).text(`Cliente: ${user_name}`);
  doc.moveDown(2);

  doc.font('Helvetica-Bold').fontSize(14).text('Descripción', {
    width: 450,
    align: 'center'
  });
  doc.moveDown(1);

  // Se utiliza el método forEach para iterar sobre los productos de la compra
  compra.productos.forEach(producto => {
    doc.font('Helvetica').fontSize(12).text(`Código: ${producto.id}`, {
      width: 595,
      align: 'justify'
    });
    doc.font('Helvetica-Bold').text(`Producto: ${producto.nombre}`)
    doc.font('Helvetica').text(`Precio unit.: ${formatCL(producto.precio)}`)
    doc.text(`Cantidad: ${producto.cantidad}`)
    doc.moveDown(1);
  });

  console.log(compra.productos)
  doc.moveDown(2);

  doc.fontSize(13).text(`Monto neto: ${formatCL(compra.monto_neto)}`, {
    width: 450,
    align: 'right'
  });
  
  doc.text(`IVA 19%: ${formatCL(compra.impuesto)}`, {
    width: 450,
    align: 'right'
  });
  
  doc.text(`Monto bruto: ${formatCL(compra.monto_bruto)}`, {
    width: 450,
    align: 'right'
  });
  
  doc.text(`Gasto envío: ${formatCL(compra.gasto_envio)}`, {
    width: 450,
    align: 'right'
  });

  const total = compra.monto_bruto + compra.gasto_envio;
  doc.moveDown(1);
  doc.font('Helvetica-Bold').fontSize(14).text(`Total: ${formatCL(total)}`, {
    width: 450,
    align: 'right'
  });
  
  doc.end()

  return doc


}