export class Categoria {
    constructor(id, categoria) {
        this.id = id,
            this.categoria = categoria
    }

    async getCategoria() {
        let dataCat = [];
        try {
            const resultado = await fetch("http://localhost:4000/API/v1/categoria");
            const data = await resultado.json();
            
            data.forEach(rows => {
                dataCat.push({
                    id: rows.id,
                    categoria: rows.categoria
                });
            })
            return dataCat;
        } catch (e) {
            throw e;
        }
    }

    async getCategoriaById(id) {
        try {
            const resultado = await fetch("http://localhost:4000/API/v1/categoria/:id");
            const data = await resultado.json();
            console.log(data)

        } catch (e) {
            throw e;
        }
    }
}