const yargs = require('yargs')

//Create port command
yargs.command({
    command: 'port',
    describe: 'Write a port',
    builder: {
        title: {
            describe: 'port',
            demandOption: false,
            type: 'number'
        }
    },
    handler: function (argv) {
        if (argv === undefined) return 8080
        if (isNaN(argv.title)) {
            console.log('No se admiten strings')
            process.exit(1)
        } 
        if (!Number.isInteger(argv.title)) {
            console.log("Debe ser un número entero")
            process.exit(1)
        }
        return argv.title
    }
})
const argv = yargs.parse()

module.exports = argv