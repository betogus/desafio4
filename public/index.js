

const socket = io();
const tablaDeProductos = (productos) => {
    let contenido = ""
    let contenidoSup = "";
    let contenidoInf = "";
    if (productos.length > 0) {
        contenidoSup =
            `
        <table class="table">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Foto</th>
                </tr>
            </thead>
        `
        productos.forEach((producto) => {
            contenidoInf +=
                `
                <tr>
                    <td>${producto.title}</td>
                    <td>${producto.price}</td>
                    <td><img src="./uploads/${producto.thumbnail}" class="foto"></td>
                </tr>
          `
        })
        contenido = contenidoSup.concat(contenidoInf)
    } else {
        contenido = `<p>No se encontraron productos</p>`
    }

    return contenido
}

let productos
socket.on('products', data => {
    let tabla = tablaDeProductos(data)
    document.getElementById('table').innerHTML = tabla
})

let loginBtn = document.getElementById('loginBtn').addEventListener('click', (e) => {
    e.preventDefault()
    fetch('/logout').then(() => location.replace('/login'))
})

console.log("Hola")
