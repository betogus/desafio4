const socket = io()
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
                    <td><img src="../uploads/${producto.thumbnail}" class="foto"></td>
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


let btn = document.getElementById('logoutBtn')
btn.addEventListener('click', evt => {
    evt.preventDefault()
    location.replace('/logout')
})

/* fetch('/auth').then(result => {
    if (result.status === 200) location.replace('/dashboard')
    else if (result.status === 401) location.replace('/login')
}) */
     

