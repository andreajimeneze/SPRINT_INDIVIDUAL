export class Empresa {
    constructor() {
        this.nombre,
        this.direccion,
        this.telefono,
        this.email,
        this.rut
    }


    async getDatosEmpresa() {
        try {
            const resultado = await fetch('http://localhost:4000/api/v1/empresa')
            const data = await resultado.json()
         
            return data
        } catch (error) {
            throw error;
        }
    }
}