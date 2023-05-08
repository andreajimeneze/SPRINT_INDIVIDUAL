export class Categoria {
    constructor(id, categoria) {
        this.id = id,
            this.categoria = categoria
    }

    async getCategorias() {
        let dataCat = [];
        try {
            const resultado = await fetch('http://localhost:4000/api/v1/categoria');
            const data = await resultado.json();
            
            data.forEach(rows => {
                dataCat.push({
                    id: rows.id,
                    categoria: rows.categoria,
                    img: rows.imgcategoria
                });
            })
            return dataCat;
        } catch (e) {
            throw e;
        }
    }

    async getCategoriaById(id) {
        try {
            const resultado = await fetch('http://localhost:4000/api/v1/categoria/:id');
            const data = await resultado.json();
            
        } catch (e) {
            throw e;
        }
    }
}