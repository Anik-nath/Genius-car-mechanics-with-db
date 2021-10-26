const express = require('express')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
require('dotenv').config();

const app = express()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8qp7t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(){
    try{
        await client.connect();
        console.log('conneted to database');
        const database = client.db("carMechanic");
        const servicesCollection = database.collection("services");
    // load data by find
    app.get('/services',async(req,res)=>{
        const cursor = servicesCollection.find({})
        const services = await cursor.toArray();
        res.send(services)
    })
    //single
    app.get('/services/:id',async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        console.log('getting service',id);
        const service =await servicesCollection.findOne(query);
        res.json(service);
    })
        //    post
    app.post('/services',async(req,res)=>{
        const service = req.body;
        console.log(service);
        console.log("hit api");
        const result = await servicesCollection.insertOne(service);
        res.json(result)
    })
    // delete
    app.delete('/services/:id',async (req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await servicesCollection.deleteOne(query)
        res.json(result)
    })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('gENIUS CAR MECHANICS')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})