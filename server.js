var express = require("express"),
    bodyParser = require("body-parser"),
    mongodb = require("mongodb"),
    objectId = require("mongodb").ObjectId;


var app = express();

//bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var port = 8080;

app.listen(port, function(){
  console.log("Servidor ativo na porta " + port);
})

app.get("/", function(req, res){
  res.json({
    msg: "Olá!!"
  });
});


var db =  new mongodb.Db(
  "apiDB",
  new mongodb.Server("localhost", 27017, {}),
  {}
);

// POST CREATE
app.post("/api", function(req, res){
  var dados = req.body;
  db.open(function(erro, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.insert(dados, function(err, records){
        if(err){
          res.json(err);
        }else{
          res.json(records);
        }
        mongoclient.close();
      });
    });
  });
});

// GET READ
app.get("/api", function(req, res){
  db.open(function(erro, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.find().toArray(function(err, results){
        if(err){
          res.json(err);
        }else{
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

// GET by ID READ
app.get("/api/:id", function(req, res){
  db.open(function(erro, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.find(objectId(req.params.id)).toArray(function(err, results){
        if(err){
          res.json(err);
        }else{
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

// GET by nome READ
app.get("/api/nome/:nome", function(req, res){
  var query = {
    nome: req.params.nome
  };
  db.open(function(erro, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.find(query).toArray(function(err, results){
        if(err){
          res.json(err);
        }else{
          res.json(results);
        }
        mongoclient.close();
      });
    });
  });
});

// PUT UPDATE
app.put("/api/:id", function(req, res){
  db.open(function(erro, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.update(
        { _id : objectId(req.params.id)},
        { $set : { user : req.body.user }},
        {},
        function(err, records){
          if(err){
            res.json({"status": "Deu ruim!"});
          }else{
            res.json({"status": "Atualizado com Sucesso!"});
          }
          mongoclient.close();
        }
      );
    });
  });
});

// DELETE
app.delete("/api/:id", function(req, res){
  db.open(function(erro, mongoclient){
    mongoclient.collection('postagens', function(err, collection){
      collection.remove(
        { _id : objectId(req.params.id)},
        function(err, records){
          if(err){
            res.json({"status": "Deu ruim!"});
          }else{
            res.json({"status": "Removido com Sucesso!"});
          }
          mongoclient.close();
        }
      );
    });
  });
});
