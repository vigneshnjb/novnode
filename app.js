var express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const bodyParser = require('body-parser');
const port = process.env.PORT || 2021;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const cors = require('cors');
//to receive data from form 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://vignesh:1234567890@cluster0.km8kx.mongodb.net/zomato?retryWrites=true&w=majority"
var db;

//get
app.get('/',(req,res) => {
    res.send("Welcome to Node Api248")
})





//List all restaurants
app.get('/restaurants',(req,res) =>{
    db.collection('restaurants').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



//quary exapmles
app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.stateid){
        query={state_id:Number(req.query.stateid)}
        console.log(query)
    }else if(req.query.mealtype_id){
        query={"mealTypes.mealtype_id":Number(req.query.mealtype_id)}
    }
    db.collection('restaurants').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//filterapi
//(http://localhost:8210/filter/1?lcost=500&hcost=600)
app.get('/filter/:mealType',(req,res) => {
    var sort = {cost:1}
    var skip = 0;
    var limit = 1000000000000;
    var mealType = Number(req.params.mealType);
    var query = {"mealTypes.mealtype_id":Number(mealType)};
    if(req.query.sortkey){
        sort = {cost:req.query.sortkey}
    }
    if(req.query.skip && req.query.limit){
        skip = Number(req.query.skip);
        limit = Number(req.query.limit)
    }
    if(req.query.cuisine && req.query.lcost && req.query.hcost){
        query={
            $and:[{cost:{$gt:Number(req.query.lcost),$lt:Number(req.query.hcost)}}],
            "cuisines.cuisine_id":Number(req.query.cuisine),
            "mealTypes.mealtype_id":Number(mealType)
        }
    }
    else if(req.query.cuisine){
        query = {"mealTypes.mealtype_id":mealType,"cuisines.cuisine_id":Number(req.query.cuisine) }
       //query = {"type.mealtype":mealType,"Cuisine.cuisine":{$in:["1","5"]}}
    }
    else if(req.query.lcost && req.query.hcost){
        var lcost = Number(req.query.lcost);
        var hcost = Number(req.query.hcost);
        query={$and:[{cost:{$gt:lcost,$lt:hcost}}],"mealTypes.mealtype_id":Number(mealType)}
    }
    db.collection('restaurants').find(query).sort(sort).skip(skip).limit(limit).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//list all restaurant
app.get('/location',(req,res) =>{
    db.collection('location').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})



// restaurant Details
app.get('/details/:id',(req,res) =>{
    var id = req.params.id;
    db.collection('restaurants').find({restaurant_id:Number(id)}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


// menu Details
app.get('/menu/:id',(req,res) =>{
    var id = req.params.id;
    db.collection('menu').find({restaurant_id:Number(id)}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.post('/menuItem',(req,res) => {
    console.log(req.body)
    db.collection('menu').find({menu_id:{$in:req.body.id}}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})




//list all quicksearch
app.get('/quicksearch',(req,res) =>{
    db.collection('mealtype').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


//placeOrder
app.post('/placeOrder',(req,res) => {
    console.log(req.body);
    db.collection('orders').insert(req.body,(err,result) => {
        if(err) throw err;
        res.send("Order Placed")
    })
})

app.get('/viewOrder',(req,res) => {
    db.collection('orders').find().toArray,((err,result) => {
        if (err) throw err;
        res.send(result)
    })
})



MongoClient.connect(mongourl, (err,client) => {
    if(err) console.log("Error While Connecting");
    db = client.db('zomato');
    app.listen(port,()=>{
        console.log(`listening on port no ${port}`)
    });
})


