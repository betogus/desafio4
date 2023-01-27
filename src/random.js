const cant = process.argv[2];

function random(cant) {
    let cantidad = cant === undefined? cant : 1000000;
    let randomArray = [];
    for (let i = 0; i < cantidad; i++) {
        let newNumber = Math.random()
        newNumber = parseInt(newNumber * 1000)
        randomArray.push(newNumber)
    }
    return randomArray
}
process.send(random(cant))