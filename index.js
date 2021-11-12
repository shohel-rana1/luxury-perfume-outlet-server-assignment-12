const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
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
        const usersCollection = database.collection('users');
        const brandsCollection = database.collection('brands');
        

         //GET API/ Get all data
         app.get('/brands', async (req, res) => {
            const cursor = brandsCollection.find({});
            const brands = await cursor.toArray();
            res.send(brands);
        });

        //POST API/ to add a brands
        app.post('/brands', async (req, res) => {

            const brand = req.body
            console.log('hit the post brand api', brand);
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
            console.log('Getting particular id', id)
            const query = { _id: ObjectId(id) };
            const perfume = await perfumesCollection.findOne(query);
            console.log(perfume)
            res.json(perfume);
        });

        //POST API/ to add a perfume
        app.post('/perfumes', async (req, res) => {

            const perfume = req.body
            console.log('hit the post perfume api', perfume);
            const result = await perfumesCollection.insertOne(perfume);
            console.log(result)
            res.json(result)
        });

        //GET API to get all the orders
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
        });

            //POST API/ to post users
            app.post('/users', async (req, res) => {

                const user = req.body
                console.log('hit the post user api', user);
                const result = await usersCollection.insertOne(user);
                console.log(result)
                res.json(result)
            });
            //DELETE API for order delete
            app.delete('/users/:id', async (req, res) => {
                const id = req.params.id;
                const query = { _id: ObjectId(id) };
                const result = usersCollection.deleteOne(query);
                console.log('delete the user by id', id)
                res.json(result)
            })

        //Delete API for single perfume delete
        app.delete('/perfumes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await perfumesCollection.deleteOne(query);
            res.json(result);
        });
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Welcome to luxury perfume outlet!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})