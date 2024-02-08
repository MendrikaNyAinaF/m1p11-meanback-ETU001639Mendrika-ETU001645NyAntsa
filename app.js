const router = require('./router/route');

const express = require('express');
const app = express()
const MongoClient = require('mongodb').MongoClient

const {parseCrudEntity} = require('./utilities/urlParser')
const bodyParser = require('body-parser');

const dotenv = require('dotenv');
const config = require('./config');

const jwt = require('jsonwebtoken');

const {sendError} =require('./utilities/response')

const {notProtectedRoutes} = require('./router/notProtectedRoute');

dotenv.config();

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envConfig = config[process.env.NODE_ENV];

const connectionString = envConfig.mongoURI;


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.urlencoded({extended: false}));
app.use(express.json());


MongoClient.connect(connectionString, {useUnifiedTopology: true})
    .then(client => {
            console.log('Connected to Database')
            const db = client.db(envConfig.dbName)

            const verifyToken = (req, res, next) => {
                notProtectedRoutes()
                if(notProtectedRoutes().includes(req.path)){
                    next();
                    return;
                }
                const token = req.headers.authorization;

                if (!token) {
                    return sendError(res, 'No token provided', 403)
                }

                jwt.verify(token, envConfig.secretKey, (err, decodedToken) => {
                    if (err) {
                        return res.status(401).json({message: 'Invalid token'});
                    }
                    req.userId = decodedToken.userId;
                    next();
                });
            };

            const dbMiddleware = (req, res, next) => {
                console.log(`DB Middleware for path : ${req.path}`);
                let entity = parseCrudEntity(req.path);
                req.entity = entity;
                req.db = db;
                req.envConfig = envConfig;
                next();
            }

            app.use(verifyToken);
            app.use(dbMiddleware);

            router.routes().map(route => {
                // use the middle for everything
                app[route.method](route.path, route.handler);
            })

            app.listen(3000, () => {
                    console.log('Server is listening on port 3000');
                }
            );
        }
    )
    .catch(error => console.error(error))