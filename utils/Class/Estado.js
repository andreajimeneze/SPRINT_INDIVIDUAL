export class Estado {
    constructor(id, descripcion) {
        this.id = id,
            this.descripcion = descripcion
    }

    async getEstados() {
        let dataEstado = [];
        try {
            const resultado = await fetch("http://localhost:4000/api/v1/estado");
            const data = await resultado.json();
            
            data.forEach(rows => {
                dataEstado.push({
                    id: rows.id,
                    descripcion: rows.descripcion
                });
            })
            return dataEstado;
        } catch (e) {
            throw e;
        }
    }

//     async getCategoriaById(id) {
//         try {
//             const resultado = await fetch("http://localhost:4000/api/v1/categoria/:id");
//             const data = await resultado.json();
//             console.log(data)

//         } catch (e) {
//             throw e;
//         }
//     }
}