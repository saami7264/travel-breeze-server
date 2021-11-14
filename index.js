const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express()
const port = process.env.PORT || 9000

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rlec2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        // console.log('Connected to db');

        const database = client.db("travels");
        const packagesCollection = database.collection("packages");
        const ordersCollection = database.collection("orders");


        //GET API
        app.get('/packages', async (req, res) => {
            const query = {};
            const options = {};
            const cursor = packagesCollection.find(query, options);

            const packages = await cursor.toArray();

            res.send(packages);

        })


        //GET API(SINGLE SERVICE)
        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };

            const package = await packagesCollection.findOne(query);
            res.json(package);
        })


        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        app.get('/orders', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }

            const cursor = ordersCollection.find(query);
            const orders = await cursor.toArray();
            res.json(orders)
        })

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);

            res.json(result)
        })


    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Lets Travel')
})



app.listen(port, () => {
    console.log(`Running Server at http://localhost:${port}`)
})