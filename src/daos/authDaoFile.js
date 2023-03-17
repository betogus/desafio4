import { __dirname } from "../utils.js"
import fs from 'fs'

export default class AuthDaoFile {
    constructor() {
        this.path = __dirname + "/files/users.json"
        this.#init()
    }

    #init = async() => { //el # significa que es un metodo privado
        if (!fs.existsSync(this.path)) { //Primero creo el archivo, y luego le agrego un array vacío
            await fs.promises.mkdir(__dirname + "/files", { recursive: true }); 
            await fs.promises.writeFile(this.path, JSON.stringify([]));
        }
    }

    #readFile = async() => {
        let data = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(data)
        
    }

    authUser = async (username, password) => {
        let users = await this.#readFile()
        let user = users.find(item => item.username === username)
        if (user.password === password) return user
        else return { status: 400, message: "El usuario y/o contraseña no coinciden" }
    }

    addUser = async(user) => {
        let users = await this.#readFile()
        let findUser = users.find(item => item.username === user.username)
        console.log(user)
        if (findUser) return {status:400, message: "Ya existe un usuario con ese nombre"}
        else {
            users.push(user)
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, '\t'))
            return user
        }
    }
}
