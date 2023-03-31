
let agregarAlCarrito = document.getElementById('products-container')
let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];

agregarAlCarrito.addEventListener('click', (e) => {
    let productoSeleccionado;
    if (e.target.parentNode.className == "product-item") {
        let idProductoSeleccionado = e.target.parentNode.id        
        axios.post('/products/getProductById', {idProductoSeleccionado})
        .then(response => {
            productoSeleccionado = response.data
            console.log(productoSeleccionado)
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
        })
    }

})

