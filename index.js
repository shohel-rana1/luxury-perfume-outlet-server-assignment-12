const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qj16f.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('perfume_shop');
        const perfumesCollection = database.collection('perfumes');
        const brandsCollection = database.collection('brands');
        const orderCollection = database.collection('orders');
        const usersCollection = database.collection('users');
        const reviewsCollection = database.collection('reviews');

        //GET API to get all reviews
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        //POST API/ to post revies
        app.post('/reviews', async (req, res) => {
            const review = req.body
            const result = await reviewsCollection.insertOne(review);
            res.json(result)
        });

        //save users to database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        //upsert google login
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        //Make Admin
        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        });


        //GET API/ Get all data
        app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find({});
            const brands = await cursor.toArray();
            res.send(brands);
        });

        //POST API/ to add a brands
        app.post('/brands', async (req, res) => {
            const brand = req.body
            const result = await brandsCollection.insertOne(brand);
            console.log(result)
            res.json(result)
        });

        //GET API/ Get all data
        app.get('/perfumes', async (req, res) => {
            const cursor = perfumesCollection.find({});
            const perfumes = await cursor.toArray();
            res.send(perfumes);
        });

        //GET API to get a single data
        app.get('/perfumes/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) };
            const perfume = await perfumesCollection.findOne(query);
            res.json(perfume);
        });

        //POST API/ to add a perfume
        app.post('/perfumes', async (req, res) => {
            const perfume = req.body
            const result = await perfumesCollection.insertOne(perfume);
            res.json(result)
        });

        //Delete API for single perfume delete
        app.delete('/perfumes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumesCollection.deleteOne(query);
            res.json(result);
        });

        //GET API to get all the orders
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //POST API/ to post users
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order);
            res.json(result)
        });
        //DELETE API for order delete
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = orderCollection.deleteOne(query);
            res.json(result)
        });

        //update API user
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    status: updateUser[0]
                }
            };
            const result = await orderCollection.updateMany(filter, updateDoc, options);
            res.send(result);


        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to luxury perfume outlet Server!')
})

app.listen(port, () => {
    console.log(`listening the port at ${port}`)
})