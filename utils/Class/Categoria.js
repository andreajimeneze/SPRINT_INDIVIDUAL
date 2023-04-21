import pool from "../../conect.js";

export class Categoria {
    constructor(id, categoria) {
        this.id = id,
        this.categoria = categoria
    }

    async getCategoria() {
        let data = [];
        try {
            const consulta = await pool.query('SELECT * FROM categoria');

            consulta.rows.forEach(rows => {
                data.push({
                    id: rows.id,
                    categoria: rows.categoria
                });
            })
            return data;
        } catch (e) {
            throw e;
        }
    }

    async getCategoriaById(id) {
        try {
            const consulta = await pool.query('SELECT * FROM categoria WHERE id = $1', [ id ]);
            console.log(consulta.rows[0])
            
            } catch (e) {
            throw e;
        }
    }
    }