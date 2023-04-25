export class Producto {
    constructor(id, nombre, precio, foto, existencia, categoria_id) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
        this.existencia = existencia;
        this.categoria_id = categoria_id;
    }


    // OBTIENE TODOS LOS PRODUCTOS (NOMBRE, PRECIO, IMAGEN, EXISTENCIA) DE LA TABLA PRODUCTO Y NOMBRE DE LA CATEGORÍA A LA QUE PERTENECE (JOIN CON TABLA CATEGORÍA) 
    //---- SE UTILIZA PARA MOSTRAR LAS CARDS DE PRODUCTOS ----
    async getProductsByCategory() {
        let dataPdto = [];

        try {
            const resultado = await fetch("http://localhost:4000/API/v1/producto");
            const data = await resultado.json();

            data.forEach(rows => {
                dataPdto.push({
                    id: rows.id,
                    nombre: rows.nombre,
                    precio: rows.precio,
                    imagen: rows.imagen,
                    existencia: rows.existencia,
                    categoria_id: rows.categoria_id,
                    categoria: rows.categoria
                });
            })

            return dataPdto;
        } catch (e) {
            throw e;
        }
    }

    // OBTIENE EL PRODUCTO  DE LA TABLA PRODUCTO POR SU ID
    // SE UTILIZA PARA AGREGAR PRODUCTOS AL CARRO
    async getProductById(id) {
        try {
            const resultado = await fetch(`http://localhost:4000/API/v1/producto/${id}`);
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
            const resultado = await fetch("http://localhost:4000/API/v1/producto");
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
            const resultado = await fetch("http://localhost:4000/API/v1/producto", {
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

            const resultado = await fetch(`http://localhost:4000/API/v1/producto/${id}`, {
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
    async modifPdto(nombre, precio, imagen, existencia, categ, id) {
        try {
            const resultado = await fetch(`http://localhost:4000/API/v1/producto/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ nombre, precio, imagen, existencia, categ, id }),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "aplication/json"
                }
            });

            const datos = await fetch("http://localhost:4000/api/v1/producto");
            const data = await datos.json();

        } catch (e) {
            console.log(e)
        }

    }
}
