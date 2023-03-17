import PersistenceFactory from "../daos/PersistenceFactory.js"

export default class AuthService {
    constructor() {
        this.usersDao
        this.#init()
    }

    #init = async() => {
        this.usersDao = await PersistenceFactory.getPersistence()
    }

    addUser = async (user) => {
        return await this.usersDao.addUser(user)
    }

    authUser = async (username, password) => {
        return await this.usersDao.authUser(username, password)
    }
}
