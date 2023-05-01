export class Producto {
    constructor(id, nombre, precio, foto, existencia, categoria_id) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
        this.existencia = existencia;
        this.categoria_id = categoria_id;
    }


    // OBTIENE TODOS LOS PRODUCTOS (NOMBRE, PRECIO, IMAGEN, EXISTENCIA) DE LA TABLA PRODUCTO Y NOMBRE DE LA CATEGORÍA A LA QUE PERTENECE (JOIN CON TABLA CATEGORÍA) --- SÓLO SE MUESTRAN LOS PRODUCTOS DISPONIBLES, ES DECIR CON ID_ESTADO 1
    //---- SE UTILIZA PARA MOSTRAR LAS CARDS DE PRODUCTOS ----
    async getProductsByCategory() {
        let dataPdto = [];

        try {
            const resultado = await fetch("http://localhost:4000/api/v1/producto");
            const data = await resultado.json();

            data.forEach(rows => {
                dataPdto.push({
                    id: rows.id,
                    nombre: rows.nombre,
                    precio: rows.precio,
                    imagen: rows.imagen,
                    existencia: rows.existencia,
                    categoria_id: rows.categoria_id,
                    categoria: rows.categoria,
                    estado: rows.id_estado
                });
            })

            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    // OBTIENE TODOS LOS PRODUCTOS (NOMBRE, PRECIO, IMAGEN, EXISTENCIA, ESTADO) DE LA TABLA PRODUCTO Y NOMBRE DE LA CATEGORÍA A LA QUE PERTENECE (JOIN CON TABLA CATEGORÍA) --- SE MUESTRAN LOS PRODUCTOS DISPONIBLES Y NO DISPONIBLES, ES DECIR CON ID_ESTADO 1 Y 2.
    //---- SE UTILIZA PARA MOSTRAR EN EL MANTENEDOR ----
    async getPdtosEstado() {
        let dataPdto = [];

        try {
            const resultado = await fetch("http://localhost:4000/api/v1/producto/estado");
            const data = await resultado.json();

            data.forEach(rows => {
                dataPdto.push({
                    id: rows.id,
                    nombre: rows.nombre,
                    precio: rows.precio,
                    imagen: rows.imagen,
                    existencia: rows.existencia,
                    categoria_id: rows.categoria_id,
                    categoria: rows.categoria,
                    estado: rows.id_estado,
                    estadoDesc: rows.descripcion
                });
            })
            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    // OBTIENE TODOS LOS PRODUCTOS ORDENADOS POR PRECIO ASCENDENTE (ORDER BY)
    async getPdtosByPrize(precio) {
        try {
            const resultado = await fetch("http://localhost:4000/api/v1/producto/prize")
            const data = await resultado.json();
            console.log(data)
            if (data.length > 0) {
                return data;
            } else {
                console.log("Producto no encontrado")
            }
        } catch (error) {
            console.log(error)
        }
    };

    // OBTIENE CANTIDAD DE PRODUCTOS POR CATEGORÍA
    async getCantPdtoCateg() {
        let dCantCat = [];
        try {
            const resultado = await fetch('http://localhost:4000/api/v1/producto/categ');
            const data = await resultado.json();
            console.log(data)

            data.forEach((rows) => {
                dCantCat.push({
                    cantidad: rows.cantidad,
                    categoria: rows.categoria
                })
            });
            return dCantCat;
        } catch (error) {
            console.log(error)
        }

    }

    // OBTIENE UN PRODUCTO  DE LA TABLA PRODUCTO POR SU ID
    // SE UTILIZA PARA AGREGAR PRODUCTOS AL CARRO
    async getProductById(id) {
        try {
            const resultado = await fetch(`http://localhost:4000/api/v1/producto/${id}`);
            const data = await resultado.json();

            const item = data[0]

            if (item) {
                return new Producto(
                    item.id,
                    item.nombre,
                    item.precio,
                    item.imagen,
                    item.existencia
                );
            } else {
                console.log(`Producto ${id} no existe`)
            }
        } catch (e) {
            throw e;
        }
    }

    // OBTIENE UN PRODUCTO (NOMBRE, CATEGORÍA_ID) CON EL NOMBRE DE LA CATEGORÍA EN BASE A LA ID DE LA CATEGORÍA (JOIN CON TABLA CATEGORÍA)
    // SE UTILIZA PARA FILTRAR LOS PRODUCTOS POR CATEGORÍA

    async getProductByCategory(categoria) {
        const dataPdto = []
        try {
            const resultado = await fetch("http://localhost:4000/api/v1/producto");
            const data = await resultado.json();

            const items = data.filter(e => e.categoria_id == categoria)

            items.forEach(rows => {
                dataPdto.push({
                    id: rows.id,
                    nombre: rows.nombre,
                    precio: rows.precio,
                    foto: rows.imagen,
                    existencia: rows.existencia,
                    categoria_id: rows.categoria
                })
            });

            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    // AGREGA PRODUCTO NUEVO ----- SE UTILIZA PARA AGREGAR PRODUCTOS DESDE EL MANTENEDOR -----
    async addPdto(nombre, precio, imagen, existencia, categoria_id) {
        const pdto = new Producto()
        const bdpdtos = await pdto.getProductsByCategory()
        let pdtoExist = bdpdtos.find((e) => e.nombre == nombre)

        if (!pdtoExist) {
            const resultado = await fetch("http://localhost:4000/api/v1/producto", {
                method: "POST",
                body: JSON.stringify({ nombre, precio, imagen, existencia, categoria_id }),
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const datos = await fetch("http://localhost:4000/api/v1/producto");
            const data = await datos.json();

            return data
        } else {
            console.log("Producto ya existe en la Base de Datos")
            return null
        }
    }

    // ELIMINAR PRODUCTO  ----- SE UTILIZA PARA ELIMINAR PRODUCTOS DESDE EL MANTENEDOR -----
    async deletePdto(id) {
        try {

            const resultado = await fetch(`http://localhost:4000/api/v1/producto/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "aplication/json"
                }
            });

            if (resultado.status === 200) {
                const datos = await fetch("http://localhost:4000/api/v1/producto");
                const data = await datos.json();

                return data
            }

        } catch (e) {
            throw e;
        }
    }

    // MODIFICAR PRODUCTO  ----- SE UTILIZA PARA MODIFICAR LOS PRODUCTOS DESDE EL MANTENEDOR -----
    async modifPdto(nombre, precio, imagen, existencia, categ, estado, id) {
        try {
            const resultado = await fetch(`http://localhost:4000/api/v1/producto/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ nombre, precio, imagen, existencia, categ, estado, id }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "aplication/json"
                }
            });
            console.log(resultado)
            const datos = await fetch("http://localhost:4000/api/v1/producto");
            const data = await datos.json();

        } catch (e) {
            console.log(e)
        }

    }
}
