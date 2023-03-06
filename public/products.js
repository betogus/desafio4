import {PRODUCTS} from './database/products.js'
let container = document.getElementById('products-container')

let cargarProductos = () => {
    for (let i = 0; i < PRODUCTS.length; i++) {
        container.innerHTML += `
        <div class="product-item" id="${PRODUCTS[i].id}">
        <p class="product-text">Nombre: ${PRODUCTS[i].name}</p>
        <p class="product-text">Precio: ${PRODUCTS[i].precioKg}</p>
        </div>`
    }
} 
cargarProductos();



let agregarAlCarrito = document.getElementById('products-container')
let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];


agregarAlCarrito.addEventListener('click', (e) => {
    if (e.target.parentNode.className == "product-item") {
        let idProductoSeleccionado = e.target.parentNode.id
        let productoSeleccionado = PRODUCTS.find(item => item.id === parseInt(idProductoSeleccionado))
        productosEnElCarrito.push(productoSeleccionado)
        localStorage.setItem("productos", JSON.stringify(productosEnElCarrito));
        //Toastify
        Toastify({
            text: `Se agregó ${productoSeleccionado.name} al carrito`,
            duration: 3000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(to right, #fbb467, #f7d096)",
            },
        }).showToast();
    }

})

