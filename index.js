const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5007;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4pbeyr5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const productCollection = client
      .db("GadgetJunction")
      .collection("products");

    //receive data from server by post method
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productCollection.insertOne(product);
      console.log(result);
      res.send(result);
    });

    //get
    app.get("/products", async (req, res) => {
      const result = await productCollection.find().toArray();
      res.send(result);
    });



    //update
    app.get('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id : new ObjectId(id)}
        const result = await productCollection.findOne(query);
        res.send(result)
    })

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      //   console.log("Update data", id, data);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const data = req.body;
      const updateDetails = {
        $set: {
          image: data.image,
          name: data.name,
          brandName: data.brandName,
          type: data.type,
          price: data.price,
          details: data.details,
          rating: data.rating,
        }
      };
      const result = await productCollection.updateOne(filter, updateDetails,options);
      res.send(result)
    });



    //cart backend
    const cartCollection = client
    .db("GadgetJunction")
    .collection("cart");

    app.post('/carts', async(req, res) =>{
        const {_id ,...newCart} = req.body
        console.log(newCart);
        const result = await cartCollection.insertOne(newCart);
        res.send(result)
    })
    app.get("/carts", async (req, res) => {
        const result = await cartCollection.find().toArray();
        res.send(result);
      });



    //delete
    app.delete('/carts/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id) };
        const result = await cartCollection.deleteOne(query);
        res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Gadget Junction  server is running");
});

app.listen(port, () => {
  console.log(`Gadget Junction server is running on port:${port}`);
});
