import supertest from 'supertest'
import { expect } from 'chai'

const request = supertest('http://localhost:8080')

describe('test Products', () => {
    describe('GET', () => {
        it('Debe verificar que no devuelva un array vacío', async () => {
            let res = await request.get('/products')
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array').that.is.not.empty;
        })
        it('Debe devolver un producto si se le pasa un ID válido', async () => {
            const productId = 1;
            const res = await request.get(`/products/${productId}`);
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('id', productId);
        });
    })
})
describe('POST', () => {
    it('Verificamos que el producto se añadió con éxito si éste cumple con todos los campos', async () => {
        const producto = {
            name: 'Banana deshidratada',
            precio100gr: 27,
            precioKg: 250,
            hayStock: true,
            categoryId: 5,
        }
        let res = await request.post('/products').send(producto)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'El producto se añadió con éxito');

    })
})

describe('PUT', () => {
    it('Verificamos que el producto se actualizó con éxito si éste cumple con todos los campos', async () => {
        const producto = {
            name: 'Banana deshidratada',
            precio100gr: 27,
            precioKg: 250,
            hayStock: true,
            categoryId: 5,
            id: 80
        }
        let res = await request.put('/products').send(producto)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'El producto se modificó con éxito');

    })
})

describe('DELETE', () => {
    let productId = 80
    it('Verificamos que el producto se eliminó con éxito', async () => {
        let res = await request.delete(`/products/${productId}`)
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message', 'El producto se eliminó con éxito');
    })
})