var express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config()
const bodyParser = require('body-parser');
const port = process.env.PORT || 2021;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//to receive data from form 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://vignesh:1234567890@cluster0.km8kx.mongodb.net/zomato?retryWrites=true&w=majority"
var db;

//get
app.get('/',(req,res) => {
    res.send("Welcome to Node Api248")
})





//quary exapmles
app.get('/restaurant',(req,res) =>{
    var query = {}
    if(req.query.cityId){
        query={city:req.query.cityId}
    }else if(req.query.mealtype){
        query={"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurants').find(query).toArray((err,result)=>{
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



//list all restaurant wrt to city
//list all reataurant wrt to city
//params exapmles
/*app.get('/reataurant/:cityId',(req,res) =>{
    var cityId = req.params.cityId;
    db.collection('reataurant').find({city:cityId}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})*/


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


