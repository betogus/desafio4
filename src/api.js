import fs from 'fs'
import { logger } from './winston/winston.js';
 
export class Api {
   constructor(){}

    getAllProducts(file){
       let productos;
        try {
        let data = fs.readFileSync(file, 'utf8');
        productos = data.length > 0 ? JSON.parse(data) : [] ; 
       } catch(err) {
        logger.error('Error en la lectura del archivo', err)
       }
       return productos
    }

    findProduct(id, file){
        let productos
        try {
        let data = fs.readFileSync(file, 'utf8');
        productos = data.length > 0 ? JSON.parse(data) : []; 
       } catch(err) {
        logger.error('Error en la lectura del archivo', err)
       }
       return productos.find(producto => producto.id === parseInt(id))
       
    }

    replaceProduct(id, producto, file) {
        let productos
        try {
            let data = fs.readFileSync(file, 'utf8');
            productos = data.length > 0 ? JSON.parse(data) : [];
            producto.id = id
            productos.splice(id-1,1,producto)
            productos = JSON.stringify((productos),null,2)
            fs.writeFileSync(file, productos)
        } catch(err) {
            logger.error('Error en la lectura del archivo', err)
        }
      

        return productos
    } 
    createProduct(producto, file) {
        //obtenemos todos los productos del archivo txt
        let productos
        try {
        let data = fs.readFileSync(file, 'utf8');
        productos = data.length > 0 ? JSON.parse(data) : [] ;
       } catch(err) {
        logger.error('Error en la lectura del archivo', err)
       }
        //agregamos el producto al archivo
        let id = productos.length+1;
        producto.id = id
        productos.push(producto)
        //reescribimos el archivo txt
        productos = JSON.stringify((productos),null,2)
        try {
            fs.writeFileSync(file, productos)
            console.log({message: "se añadio con exito", productos})
        } catch(err){
            logger.error('Error en la escritura',err)
        }
       

        
    }
    deleteProduct(id, file) {
        let productos
        try {
            let data = fs.readFileSync(file, 'utf8');
            productos = data.length > 0 ? JSON.parse(data) : [];
            productos = productos.filter(producto => producto.id !== parseInt(id)) 
            productos = JSON.stringify((productos),null,2)
            fs.writeFileSync(file, productos)
        } catch(err) {
            logger.error('Error en la lectura del archivo', err)
        }
      
    }

}

