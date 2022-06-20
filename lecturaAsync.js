const fs = require("fs");

fs.readFile("./textoPrueba.txt", (e, textoArchivo) => {
    if (e) throw e;
    console.log(textoArchivo.toString());
});

console.log("fin del programa");