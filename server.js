var express = require('express')
var bodyParser = require('body-parser')
var low = require('lowdb')
var FileAsync = require('lowdb/adapters/FileAsync')

var app = express()
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT');
  next();
});


app.use(bodyParser.json())

const adapter = new FileAsync('db.json')
low(adapter)
  .then(db => {
    app.get('/persons', function(req, res, next) {
      var post = db.get('persons')
        .value()

      res.send(post)
    });


    app.post('/persons', function(req, res, next) {
        console.log(req)
        db.get('persons')
        .push(req.body)
        .last()
        .assign({ id: Date.now().toString() })
        .write()
        .then(post => res.send(post))
    })

    return db.defaults({ persons: [] }).write()
  })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => console.log('listening on port 8000'))
  })