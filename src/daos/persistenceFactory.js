import config from '../config.js'

export default class PersistenceFactory {
    static getPersistence = async() => {
        switch(config.app.persistence) {
            case "ARRAY":
                let { default: AuthDaoArray } = await import('./authDaoArray.js') //importacion dinamica
                return new AuthDaoArray()
            case "FILE":
                let { default: AuthDaoFile } = await import('./authDaoFile.js')
                return new AuthDaoFile()
        }
    }
}
