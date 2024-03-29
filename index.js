//const fs = require ("fs");
import fs from 'fs';


class ProductManager {
    #url= "https://las_fotos.com/";
    constructor(path) {
        this.path = path;
        console.log("Este es el path: ", this.path)
        
    }

    getProducts = async() => {

        const data = await fs.promises.readFile(this.path, 'utf-8');
        const productos = JSON.parse(data);
        console.log("Lista de todos los productos: ", productos);

        return productos
    }

    generarId = async() => {
        let index = 0;
        const productos = await this.getProducts();
        
        if (!productos.length){
         return index = 1;
        }
        index = productos.pop().id +1;
        console.log("Id generado: ", index)
        return index;
    }
    
    
    addProduct = async(producto) => {
        const productos = await this.getProducts();
        console.log("🚀 ~ ProductManager ~ addProduct=async ~ productos:", productos)
        
        if (productos) {
            producto.id = await this.generarId(); 
            producto.thumbnail = this.#url + producto.thumbnail;
        }
        else {
            producto.id = 1;
            producto.thumbnail = this.#url + producto.thumbnail;
        }
        productos.push(producto);
        console.log("Producto agregado: ", productos)
        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
    }

    
    getProductById = async(id) => {
        const productos = await this.getProducts();
        const producto_buscado = productos.find ((producto) => producto.id === id);
        if (!producto_buscado) {
            console.log ("Product NOT FOUND");
            throw (error);
        }
        else {
            console.log("Producto buscado por id: ", producto_buscado);
            return producto_buscado;  
        }
    }

    updateProduct = async(producto_a_actualizar) => {

        const producto_buscado = await this.getProductById(producto_a_actualizar.id);
        if (producto_buscado) {
            const productos = await this.getProducts();
            let index = productos.findIndex((producto) => producto.id === producto_buscado.id)
            for (let key in producto_a_actualizar) {
                productos[index][key] = producto_a_actualizar[key];
            }
            console.log("Con producto actualizado: ", productos);
            await fs.promises.writeFile(this.path, JSON.stringify(productos, null, "\t"));
        }
        else {
            console.log ("Product NOT FOUND");
            throw (error);
        }
    }

    deleteProduct = async(id) => {
        const nuevo_array = [];
        const producto_buscado = await this.getProductById(id);
        if (producto_buscado) {
            const productos = await this.getProducts();
            let index = productos.findIndex((producto) => producto.id === producto_buscado.id)
            for (let i=0; i< productos.length; i++) {
                if (i === index) {
                    continue;
                }
                else {
                    nuevo_array.push(productos[i]);
                }
            }
            console.log("Con producto borrado: ", nuevo_array);
            await fs.promises.writeFile(this.path, JSON.stringify(nuevo_array, null, "\t"));
        }
        else {
            console.log ("Product NOT FOUND");
            throw (error);
        }
    }

}

let prod = new ProductManager("./Productos.json");
//prod.getProducts();
let producto_nuevo = {
    "title": "buzo",
    "description": "color rojo",
    "price": 225,
    "thumbnail": "buzo.jpg",
    "code": "b-r",
    "stock": 32,
   };
   //prod.addProduct(producto_nuevo);
   //prod.getProductById(5)
let producto_modificado = {
    "description": "color rojo",
    "price": 325,
    "stock": 66,
    "id": 3
   };

//prod.updateProduct(producto_modificado)

prod.deleteProduct(3)