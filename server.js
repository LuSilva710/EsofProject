var express = require("express");
const session = require("express-session");
const mysql = require("mysql");
var connection_data = require("./connections.json");
const connection = mysql.createConnection(connection_data);
const { createHash } = require("crypto");
var app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.set("views", "./views");

// Variável para armazenar o carrinho de compras (em memória)
let carrinho = [];

// Login page
app.get("/", function (req, res) {
  res.render("pages/login");
});

// Home page
app.get("/home", function (req, res) {
  res.render("pages/home");
});

// Carrinho page
app.get("/carrinho", function (req, res) {
  res.render("pages/carrinho", { carrinho: carrinho });
});

// Adiciona item ao carrinho
app.post("/adicionarAoCarrinho", function (req, res) {
  const item = req.body.item;
  carrinho.push(item);
  res.sendStatus(200); // Retorna um status 200 para indicar sucesso
});

// Database auth
app.post("/auth", function (req, res) {
  let email = req.body.email;
  let password = req.body.senha;
  console.log(email);
  console.log(password);
  let cripted_pass = hash(email + password);

  if (email && password) {
    connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          console.log(cripted_pass);
          console.log(results.senha);

          req.session.loggedin = true;
          req.session.username = email;

          res.redirect("/home");
        } else {
          res.send("Email ou Senha Incorretos!");
        }
        res.end();
      }
    );
  } else {
    res.end();
  }
});

app.post("/register", function (req, res) {
  let username = req.body.nome;
  let password = req.body.senha;
  let email = req.body.email;
  let cripted_pass = hash(email + password);

  if (username && password && email) {
    // Verifica se o e-mail já está cadastrado
    connection.query(
      "SELECT * FROM hamburgueria.usuario WHERE email = ?",
      [email],
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          // O e-mail já está cadastrado
          res.send("Este e-mail já está cadastrado. Por favor, escolha outro.");
        } else {
          // O e-mail não está cadastrado, então insere o novo usuário
          connection.query(
            "INSERT INTO hamburgueria.usuario (nome, email, senha) VALUES(?, ?, ?);",
            [username, email, cripted_pass],
            function (error, results, fields) {
              if (error) throw error;
              console.log(results);
              res.redirect("/");
            }
          );
        }
      }
    );
  } else {
    res.send("Envie todas as credenciais!");
    res.end();
  }
});

app.listen(8080);
console.log("Server is listening on port 8080");

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}
