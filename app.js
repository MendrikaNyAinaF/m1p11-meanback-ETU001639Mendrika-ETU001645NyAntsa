const router = require('./router/router');

const express = require('express');
const app = express()
const MongoClient = require('mongodb').MongoClient

const {parseCrudEntity} = require('./utilities/urlParser')
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const config = require('./config');

dotenv.config();

const cors = require('cors');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envConfig = config[process.env.NODE_ENV];

const connectionString = envConfig.mongoURI;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.use(cors())


MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
            console.log('Connected to Database')
            const db = client.db(envConfig.dbName)
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
