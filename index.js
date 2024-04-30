const express = require('express')
const port = process.env.PORT || 5000
require('dotenv').config()

// const express = require('express')
const app = express()
var cors = require("cors");

//middlewire
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mtdunhe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const database = client.db("craftsDB");
    const craftCollection = database.collection("craftCollection");
    const categoriesCollection = database.collection("categoriesCollection");
    app.post('/addcrafts',async(req,res)=>{
        const craft= req.body
        console.log(craft)
        const result = await craftCollection.insertOne(craft);
        res.send(result)
    })
    app.get('/allcrafts', async(req,res)=>{
        const cursor = craftCollection.find();
        const result= await cursor.toArray()
        res.send(result)
    })
    app.get('/craftDetails/:id', async(req,res)=>{
        const objId= req.params.id;
        const query = { _id: new ObjectId(objId) };
        const result = await craftCollection.findOne(query);
        res.send(result);
    })
    app.get('/myitems/:email', async(req,res)=>{
        const receivedEmail=  req.params.email;
        const query= {email: receivedEmail};
        const cursor= craftCollection.find(query);
        const result= await cursor.toArray()
        res.send(result);

    })
    app.patch('/updateitem/:id', async(req,res)=>{
        const receivedId= req.params.id
        const filter = { _id:new ObjectId(receivedId) };
        const updateDoc = {
            $set: {
                name:req.body.name,
                image :req.body.image, 
                price :req.body.price,
                rating :req.body.rating, 
                description :req.body.description, 
                processTime :req.body.processTime, 
                stock :req.body.stock, 
                sCategory :req.body.sCategory, 
                customOption :req.body.customOption,
                email :req.body.email, 
                userName :req.body.userName
            },
          };
          const result = await craftCollection.updateOne(filter, updateDoc);
          res.send(result);

    })
    app.delete('/deletecraft/:id',async(req,res)=>{
        const gotId= req.params.id;
        const query = { _id: new ObjectId(gotId) };
        const result = await craftCollection.deleteOne(query);
        res.send(result)
    })
    app.get('/categories',async(req,res)=>{
        const cursor = categoriesCollection.find();
        const result= await cursor.toArray()
        res.send(result)
    })
    app.get('/categories/:name',async(req,res)=>{
        const receivedName=  req.params.name;
        const query= {sCategory: receivedName};
        const cursor= craftCollection.find(query);
        const result= await cursor.toArray()
        res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })