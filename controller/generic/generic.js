const {ObjectId} = require("mongodb");
const {sendError} = require('../../utilities/response')
const findAll = (req, res) => {
    checkEntity(req, res)
    const db = req.db

    const reqBody = req.body
    let search = {}
    let page = {}
    let limit = 10000000
    let skip = 0

    if (reqBody !== undefined && reqBody !== null && reqBody.search !== undefined && reqBody.search !== null) {
        search = reqBody.search
    }

    if (reqBody !== undefined && reqBody !== null && reqBody.page !== undefined && reqBody.page !== null) {
        page = reqBody.page
        if (page.size !== undefined && page.size !== null) {
            limit = parseInt(page.size)
        }
        if (page.number !== undefined && page.number !== null) {
            skip = parseInt(page.number*10)
        }
    }


    db.collection(req.entity).find(search).skip(skip).limit(limit).toArray()
        .then(genres => {
                res.send(genres)
            }
        )
        .catch(error => sendError(res, error, 500))
}

const findOne = (req, res) => {
    checkEntity(req, res)
    const db = req.db
    const collection = db.collection(req.entity)

    console.log('params id: ', req.params[0])
    let id = req.params[0]
    collection.findOne({_id: new ObjectId(id)})
        .then(result => {
            res.send(result)
        })
        .catch(error => sendError(res, error, 500))
}

const create = (req, res) => {
    checkEntity(req, res)
    const db = req.db
    const collection = db.collection(req.entity)
    console.log('req.body: ', req.body)
    collection.insertOne(req.body)
        .then(result => {
            // newly created object
            let object = result.ops[0]
            res.send(object)
        })
        .catch(error => sendError(res, error, 500))
}

const update = (req, res) => {
    checkEntity(req, res)
    const db = req.db
    const collection = db.collection(req.entity)
    let id = req.params[0]
    console.log('req.body: ', req.body, id)
    collection.findOneAndUpdate({_id: new ObjectId(id)}, {$set: req.body}, {returnDocument: 'after'})
        .then(result => {
                // newly created object
                let object = result.value
                res.send(object)
            }
        )
        .catch(error => sendError(res, error, 500))
}

const deleteOne = (req, res) => {
    checkEntity(req, res)
    const db = req.db
    const collection = db.collection(req.entity)
    let id = req.params[0]
    // Find the document before deleting
    collection
        .findOne({_id: new ObjectId(id)})
        .then(foundObject => {
            if (!foundObject) {
                return res.status(404).json({error: 'Document not found'});
            }

            // Store the found object
            const deletedObject = foundObject;

            // Delete the document
            return collection.deleteOne({_id: new ObjectId(id)})
                .then(result => {
                    if (result.deletedCount === 1) {
                        res.json(deletedObject);
                    } else {
                        sendError(res, 'Error deleting document', 500)
                    }
                });
        })
        .catch(error => sendError(res, error, 500));
}

const checkEntity = (req, res) => {
    if (req.entity == null) {
        res.send({
            code: 400,
            message: "Invalid crud url for crud mapped route"
        })
    }
}



exports.generic = {
    findAll,
    findOne,
    create,
    update,
    deleteOne
}