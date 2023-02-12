const yargs = require('yargs');
let PORT;
let MODO;
const argv = yargs
    .option('port', {
        alias: 'p',
        describe: 'Puerto en el que se iniciará la aplicación',
        type: 'number',
        default: 8080
    })
    .option('modo', {
        alias: 'm',
        describe: 'Modo de inicio de la aplicación',
        type: 'string',
        choices: ['fork', 'cluster'],
        default: 'fork'
    })
    .argv;

if (argv.modo === 'cluster') {
    console.log('Iniciando en modo cluster...');
    MODO = "cluster"
} else {
    console.log('Iniciando en modo fork...')
    MODO = 'fork'
}

PORT = argv.port
console.log(`Puerto: ${argv.port}`);

yargs.parse()

module.exports = {PORT, MODO}