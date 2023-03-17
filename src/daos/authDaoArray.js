export default class AuthDaoArray {
    constructor(){
        this.users = []
    }
    authUser = async (username, password) => {
        let user = this.users.find(item => item.username === username)
        if (user.password === password) {
            return user
        }
        else return {status: 400, message: "El usuario y/o contraseña no coinciden"}
    }

    addUser = async (user) => {
        let findUser = this.users.find(item => item.username === user.username)
        if (findUser) return {status:400, message: "Ya existe un usuario con ese nombre"}
        else {
            this.users.push(user)
            return user
        }
    }

}