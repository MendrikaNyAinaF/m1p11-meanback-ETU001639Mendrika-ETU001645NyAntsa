const {ObjectId} = require("mongodb");
const {sendError} = require('../../utilities/response')
const {crud} = require('../../service/crud')
const findAll = (req, res) => {
    checkEntity(req, res)
    const db = req.db

    const reqBody = req.body
    crud.findAll(req.entity, db, reqBody).then(genres => {
            res.send(genres)
        }
    )
        .catch(error => sendError(res, error, 500))
}

const findOne = (req, res) => {
    checkEntity(req, res)
    let id = req.params[0]
    crud.findOne(req.entity, req.db, id).then(result => {
        result === null ? sendError(res, 'No document found', 500) :
            res.send(result)
    })
        .catch(error => sendError(res, error, 500))
}

const create = (req, res) => {
    checkEntity(req, res)
    crud.create(req.entity, req.db, req.body).then(result => {
        // newly created object
        let object = result.ops[0]
        res.send(object)
    })
        .catch(error => sendError(res, error, 500))
}

const update = (req, res) => {
    checkEntity(req, res)
    let id = req.params[0]
    const reqBody = req.body

    crud.update(req.entity, req.db, reqBody, id).then(result => {
            // newly created object
            result==null || result.value === null ? sendError(res, 'No document found', 500) :
            res.send(result.value)
        }
    )
        .catch(error => sendError(res, error, 500))
}

const deleteOne = (req, res) => {
    checkEntity(req, res)
    let id = req.params[0]
    // Find the document before deleting
    crud.deleteOne(req.entity, req.db, id).then(result => {
        if (result.deletedCount === 0) {
            sendError(res, 'No document to delete', 500)
        }
        res.send({
                code: 200,
                message: "Document deleted",
                id: id
            }
        )
            .catch(error => sendError(res, error, 500));
    })
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