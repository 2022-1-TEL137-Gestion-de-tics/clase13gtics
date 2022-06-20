const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const multer = require("multer");
const mysql = require("mysql2");

const params = {
    host: "localhost",
    user: "root",
    password: "root",
    database: "hr"
}

let conn = mysql.createConnection(params);

const multerApp = multer();

const app = express();

app.use(express.static('public'));

app.get("/holaMundo", function (request, response) {
    console.log("request del cliente");
    response.send("<h1>Hola mundo</h1>");
});

app.get("/", function (req, res) {
    console.log("main");
    res.sendFile(path.join(__dirname + "/vistas/main.html"));
});

app.post("/form", function (req, res) {

    let action = req.query.action;

    console.log("por post");
    console.log("test");
    let data = {
        nombre: "juan",
        apellido: "perez",
        action: action
    };
    res.send(data);
});

//para ruta-> pathVariables/5/juan/perez
app.get("/pathVariables/:id/:nombre/:apellido", function (req, res) {
    let id = req.params.id;
    let nombre = req.params.nombre;
    let apellido = req.params.apellido;

    let data = {
        id: id,
        nombre: nombre,
        apellido: apellido
    };
    res.send(data);
});

app.post("/variablePorPostForma1",
    bodyParser.urlencoded({extended: true}), (req, res) => {
        let nombre = req.body.nombre;
        let apellido = req.body.apellido;

        res.send({
            nombre: nombre,
            apellido: apellido
        });
    });

app.post("/variablePorPostForma2", bodyParser.json(), (req, res) => {
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;

    res.send({
        nombre: nombre,
        apellido: apellido
    });
});

app.post("/variablePorPostForma3", multerApp.none(), (req, res) => {
    let nombre = req.body.nombre;
    let apellido = req.body.apellido;

    res.send({
        nombre: nombre,
        apellido: apellido
    });
});

app.get("/listaTrabajos", (req, res) => {

    let sql = "select * from jobs";

    conn.query(sql, function (err, result) {
        if (err) {
            res.json({err: "ocurrió un error"});
            console.error(err);
        } else {
            for (let i = 0; i < result.length; i++) {
                result[i]["índice"] = "número" + (i + 1);
            }
            res.json(result);
        }
    });
});

// ruta: /obtenerEmpleado?id=X
app.get("/obtenerEmpleado", function (req, res) {
    let id = req.query.id;

    let sql = "select * from employees where employee_id = ?";

    let parametros = [id];

    conn.query(sql, parametros, function (e, r) {
        if (e) throw e;
        if (r.length == 0) {
            res.json({
                result: "0"
            });
        } else {
            res.json({
                result: r.length,
                data: r
            })
        }
    });

});

app.post("/guardarTrabajo", bodyParser.json(), (req, res) => {
    let jobId = req.body.jobId;
    let jobTitle = req.body.jobTitle;
    let minSalaryStr = req.body.minSalary;
    let maxSalary = req.body.maxSalary;

    let minSalary = Number.parseInt(minSalaryStr, 10);
    minSalary += 100;

    let sql = "insert into jobs (job_id, job_title, min_salary, max_salary) VALUES (?,?,?,?)";
    let params = [jobId, jobTitle, minSalary, maxSalary];

    conn.query(sql, params, (e) => {
        if (e) throw e;

        conn.query("select * from jobs", (err, resultado) => {
            if (err) throw err;
            res.json(resultado);
        });

    });

});

app.post("/guardarTrabajoForma2", bodyParser.json(), (req, res) => {
    let jobId = req.body.jobId;
    let jobTitle = req.body.jobTitle;
    let minSalary = req.body.minSalary;
    let maxSalary = req.body.maxSalary;

    let sql = "insert into jobs SET ?";
    let params = {
        job_id: jobId,
        job_title: jobTitle,
        min_salary: minSalary,
        max_salary: maxSalary
    };

    conn.query(sql, params, (e) => {
        if (e) throw e;

        conn.query("select * from jobs", (err, resultado) => {
            if (err) throw err;
            res.json(resultado);
        });

    });

});

app.listen(3000, () => {
    console.log("servidor corriendo");
});

