const bcrypt = require('bcrypt');
const { sendError } = require("../utilities/response");
const { convertObjectId } = require("../utilities/objectId");
const jwt = require('jsonwebtoken');

const register = (req, res) => {
    let user = req.body;

    let hashedPassword = bcrypt.hashSync(user.password, 10);

    user.password = hashedPassword;

    user = convertObjectId(user)
    console.log('user: ', user)

    const db = req.db;
    db.collection('personne').insertOne(user).then(result => {
        // newly created object
        let object = result.ops[0]
        res.send(object)
    })
        .catch(error => console.log(error))
}

const login = (req, res) => {
    const user = req.body;

    const db = req.db;
    const person=req.path.split("/")[1]
    const types={
        client:"CUSTOMER",
        employee:"EMP",
        manager:"ADMIN"
    }
    var filter={ email: user.email }
    if(types[person]) filter["type.code"]=types[person]
    console.log(filter, person);

    db.collection('personne').findOne(filter).then(result => {
        if (result) {
            if (bcrypt.compareSync(user.password, result.password)) {
                const token = jwt.sign({ id: result._id }, req.envConfig.secretKey, { expiresIn: 86400 });
                res.status(200).send({ auth: true, token: token, userId: result._id });
            } else {
                sendError(res, 'Login failed', 500)
            }
        } else {
            sendError(res, 'Login failed: no account matches to the email provided', 500)
        }
    })
        .catch(error => sendError(res, error, 500))
}

module.exports = {
    register,
    login
}
