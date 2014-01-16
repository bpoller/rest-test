var express = require('express')
var app = express()
app.use(express.json())

var elasticsearch = require('elasticsearch')
var db = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
})

var shortId = require('shortid')
shortId.seed(342)

app.get('/', function(req, res) {

  db.ping({
    requestTimeout: 1000,
    hello: "elasticsearch!"
  }, function (error) {
    if (error) {
      res.send('elasticsearch cluster is down!')
    } else {
      res.send('All is well')
    }
  })
})

app.get('/test/posting', function(req, res) {
  db.search(
  {
    index: 'posting',
    size: '30'
  }).then (function (result) { res.send(mapResults(result.body.hits.hits))}, 

  function(error){sendError(res,error)})
})

app.post('/test/posting', function(req, res) {
  
 db.create({
   index: 'posting',
   type: 'posting',
   refresh: 'true',
   id: shortId.generate(),
   body: req.body
 }, function(error, result){
   if(error) sendError(res, error)
   res.send({id : result._id})
 })
})

app.get('/test/posting/:id', function(req, res) {  
  db.get({
  index: 'posting',
  type: 'posting',
  id: req.params.id
  }, function (error, result) {
     if(error) sendError(res, error)
     res.send(result._source)
  })
})

app.put('/test/posting/:id', function(req, res) {
  
  db.update({
    index: 'posting',
    type: 'posting',
    id:   req.params.id,
    body:  { doc : req.body}
  }, function (error, result) {
    if(error) sendError(res, error)
     res.send({id: result._id, version: result._version})
  })

})

app.del('/test/posting/:id', function(req, res) {
  db.delete({
  index: 'posting',
  type: 'posting',
  id: req.params.id
  }, function (error, result) {
    if(error) sendError(res, error)
    res.send(result)
  })
})

function sendError(response, error)
{
  response.status(500);
  response.send(error.message);
}

 function mapResults(list)
 {
   return list.map(function (item){ return {id : item._id, posting : item._source }})
 }


var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});