const router = require('./router/router');

const express = require('express');
const app = express()
const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb+srv://ranjalahynyantsa:c7jt3yoVjNP6vqq6@cluster0.cdwza34.mongodb.net/'

const {parseCrudEntity} = require('./utilities/urlParser')
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
            console.log('Connected to Database')
            const db = client.db('mbs-dev')
            const dbMiddleware = (req, res, next) => {
                console.log(`DB Middleware for path : ${req.path}`);
                let entity = parseCrudEntity(req.path);
                req.entity = entity;
                req.db = db;
                next();
            }

            router.routes().map(route => {
                // use the middle for everything
                app.use(dbMiddleware);
                app[route.method](route.path, route.handler);
            })

            app.listen(3000, () => {
                    console.log('Server is listening on port 3000');
                }
            );
        }
    )
    .catch(error => console.error(error))