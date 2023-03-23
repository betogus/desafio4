import axios from "axios"

async function getProducts () {
    try {
        const response = await axios.get('http://localhost:8080/products')
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
} 

//getProducts()

let userRegister = {
    username: "Benja",
    address: "Calle falsa 123",
    age: 28,
    phone: "123123123",
    email: "gus@hotmail.com",
    password: "123"
}

async function postRegistro () {
    try {
        const response = await axios.post('http://localhost:8080/auth/register', userRegister)
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//postRegistro()


let userLogin = {
    username: "Gus",
    password: "123"
}


async function postLogin() {
    try {
        const response = await axios.post('http://localhost:8080/auth/login', userLogin)
        console.log(`Status Code: ${response.status}`)
        console.log(response.data)
    } catch (err) {
        console.log(err)
    }
}

//postLogin()


