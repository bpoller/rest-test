var superagent = require('superagent')
var expect = require('expect.js')
var localhost = 'http://localhost:3000'
var remotehost = 'http://secret-journey-1239.herokuapp.com'
var host = remotehost


describe('express rest api server', function(){
  var id

  it('posts an object', function(done){
    superagent.post(host+'/test/posting')
      .send({ "name": "John"
        , "email": "john@rpjs.co"
      })
      .end(function(e,res){
        expect(e).to.eql(null)
        expect(res.body.id.length).to.eql(9)
        id = res.body.id
        done()
      })
  })

  it('retrieves an object', function(done){
    superagent.get(host+'/test/posting/'+id)
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.name).to.eql("John")            
        done()
      })
  })

  it('retrieves a collection', function(done){
    superagent.get(host+'/test/posting')
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body.map(function (item){return item.id})).to.contain(id)        
        done()
      })
  })

  it('updates an object', function(done){
    superagent.put(host+'/test/posting/'+id)
      .send({name: 'Peter'
        , email: 'peter@yahoo.com'})
      .end(function(e, res){
         expect(e).to.eql(null)
         expect(typeof res.body).to.eql('object')
         expect(res.body.version).to.eql('2')        
        done()
      })
  })

  it('checks an updated object', function(done){
    superagent.get(host+'/test/posting/'+id)
      .end(function(e, res){
        expect(e).to.eql(null) 
        expect(typeof res.body).to.eql('object')
        expect(res.body.name).to.eql('Peter')        
        done()
      })
  })    

  it('removes an object', function(done){
    superagent.del(host+'/test/posting/'+id)
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body.found).to.eql(true)    
        done()
      })
  })      
})