/* import { users } from "./models/User.js";
import { transporter } from "./configuration/nodemailer.js"; */

 const script = document.querySelector('script[src="/js/cart.js"]');
 
/* CARGAMOS LOS PRODUCTOS DEL CARRITO */

let productosEnElCarrito = JSON.parse(localStorage.getItem("productos")) || [];

let cargarCarrito = () => {
    if (!productosEnElCarrito) document.getElementById('cart-container').innerHTML = `<h3>No hay productos en el carrito</h3>`
    for (let i = 0; i < productosEnElCarrito.length; i++) {
        document.getElementById('cart-container').innerHTML += `
        <div class="product-item" id="${productosEnElCarrito[i].id}">
            <p class="product-text">Nombre: ${productosEnElCarrito[i].name}</p>
            <p class="product-text">Precio: ${productosEnElCarrito[i].precioKg}</p>
        </div>`  
    }
}

cargarCarrito()


/* AGREGAMOS LAS FUNCIONALIDADES DE LOS BOTONES */

let borrarCarrito = document.getElementById('borrarCarrito')
let confirmarCompra = document.getElementById('confirmarCompra')

//Borrar productos del carrito
borrarCarrito.addEventListener("click",()=> {
    localStorage.setItem("productos", JSON.stringify());
})


//Confirmar compra
console.log(user)

let contenidoEmail = `
<h3>Productos a enviar: <h3>
<ul>
`
productosEnElCarrito.map(item => {
    contenidoEmail += `<li>nombre: ${item.name}, precio: ${item.precioKg}</li>`
})
contenidoEmail+=`</ul>`
/* confirmarCompra.addEventListener('click', async () => {
    const userId = req.session.passport.user;
    const user = await users.findById(userId);

    const mailOptions = {
        from: TEST_MAIL,
        to: user.email, 
        subject: `Nuevo pedido de ${user.username}`,
        html: contenidoEmail
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log(info)
    } catch (error) {
        console.log(error)
    }
}) */

