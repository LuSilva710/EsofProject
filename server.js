var express = require("express");
const session = require("express-session");
const mysql = require("mysql2");
var connection_data = require("./connections.json");
const connection = mysql.createConnection(connection_data);
const { createHash } = require("crypto");
var app = express();

function requireLogin(req, res, next) {
  if (req.session.username) {
    next(); // O usuário está logado, continue para a próxima função de middleware ou rota
  } else {
    res.redirect("/"); // Redireciona para a página de login
  }
}


// Conectando ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Configurando o view engine
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

// Rota de login
app.get("/", function (req, res) {
  res.render("pages/login");
});

// Home page
app.get("/home",requireLogin ,function (req, res) {
    connection.query('SELECT * FROM produto', (error, results) => {
      if (error) throw error;
      connection.query('SELECT * FROM tipos_produto', (error, results2) => {
        if (error) throw error;
        res.render('pages/home', { produtos: results, tipos: results2 });
      })
  });
});

//rota para inserir produtos no carrinho
app.post("/insere_carrinho",requireLogin, function(req, res) {
  connection.query(
    "SELECT * FROM usuario WHERE email = ?",
    [req.session.username],
    function (error, results, fields) {
      if (error) {
        console.error("Erro na query:", error);
        res.send("Ocorreu um erro durante a autenticação.");
        return;
      }
      connection.query(
        "INSERT INTO carrinho (id_usuario, id_produto, add_em, finalizado) VALUES(?, ?, CURRENT_TIMESTAMP(), 0);",
        [Number(results[0].id_usuario), Number(req.body.id_produto)],
        function (error, results, fields) {
          if (error) {
            console.error("Erro na query:", error);
            res.send("Ocorreu um erro durante a autenticação.");
            return;
          }
          return;
        });
    });

})

// Carrinho page
app.get("/carrinho",requireLogin, function (req, res) {
  console.log(req.session.username)
  
  connection.query(
    "SELECT COUNT(p.id_produto) AS quantidade, p.id_produto, p.nome, p.valor, ROUND(COUNT(p.id_produto) * p.valor, 2) as total, p.link_imagem, t.tipo_produto FROM carrinho c "+ 
    "JOIN usuario u ON u.id_usuario = c.id_usuario "+
    "JOIN produto p ON p.id_produto = c.id_produto "+
    "JOIN tipos_produto t ON t.id_tipos_produto = p.id_tipo "+
    "WHERE u.email = ? "+
    "GROUP BY p.id_produto, p.nome, p.valor, p.link_imagem, t.tipo_produto;",
    [req.session.username],
    function (error, results, fields) {
      if (error) {
        console.error("Erro na query:", error);
        res.send("Ocorreu um erro durante a autenticação.");
        return;
      }
      res.render("pages/carrinho", { pedidos: results });
    });
 
});

app.post("/auth", function (req, res) {
  let email = req.body.email;
  let password = req.body.senha;

  let cripted_pass = hash(email + password);

  if (email && password) {
    connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
      function (error, results, fields) {
        if (error) {
          console.error("Erro na query:", error);
          res.send("Ocorreu um erro durante a autenticação.");
          return;
        }
        if (results.length > 0) {
          if (results[0].senha === cripted_pass) {
            req.session.loggedin = true;
            req.session.username = email;
            res.redirect("/home");
          } else {
            res.send("Email ou Senha Incorretos!");
          }
        } else {
          res.send("Email ou Senha Incorretos!");
        }
        res.end();
      }
    );
  } else {
    res.send("Por favor, preencha ambos os campos!");
    res.end();
  }
});


app.post("/register", function (req, res) {
  let username = req.body.nome;
  let password = req.body.senha[0];
  let email = req.body.email;
  let cripted_pass = hash(email + password);

  if (username && password && email) {
    connection.query(
      "SELECT * FROM usuario WHERE email = ?",
      [email],
      function (error, results, fields) {
        if (error) {
          console.error("Erro na query:", error);
          res.send("Ocorreu um erro durante o registro.");
          return;
        }

        if (results.length > 0) {
          res.send("Este e-mail já está cadastrado. Por favor, escolha outro.");
        } else {
          connection.query(
            "INSERT INTO usuario (nome, email, senha) VALUES(?, ?, ?);",
            [username, email, cripted_pass],
            function (error, results, fields) {
              if (error) {
                console.error("Erro ao inserir novo usuário:", error);
                res.send("Ocorreu um erro ao inserir o novo usuário.");
                return;
              }
              console.log("Novo usuário registrado com sucesso:", results);
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

app.post("/checkout", requireLogin, function(req, res){
  console.log("Valor chegou no server")
  var itens_obj_json = req.body.data_json;
  var itens_obj = JSON.parse(itens_obj_json);
  itens_obj['1'].va
  console.log(itens_obj);
  res.render("pages/checkout" , {itens : itens_obj})

});

app.listen(8080);
console.log("Server is listening on port 8080");

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}
