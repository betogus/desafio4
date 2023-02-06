const yargs = require('yargs');
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

if (argv.modo === 'fork') {
    console.log('Iniciando en modo fork...');
} else if (argv.modo === 'cluster') {
    console.log('Iniciando en modo cluster...');
} else {
    console.error('Error: debes proporcionar una opción válida. Las opciones disponibles son "fork" y "cluster".');
    process.exit(1);
}

console.log(`Puerto: ${argv.port}`);

yargs.parse()

module.exports = argv