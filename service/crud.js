const {sendError} = require("../utilities/response");
const {ObjectId} = require("mongodb");
const findAll = (entity, db, object) => {
    let search = {}
    let page = {}
    let limit = 10000000
    let skip = 0
    let sort={}

    if (object !== undefined && object !== null && object.search !== undefined && object.search !== null) {
        search = object.search
    }

    if (object !== undefined && object !== null && object.page !== undefined && object.page !== null) {
        page = object.page
        if (page.size !== undefined && page.size !== null) {
            limit = parseInt(page.size)
        }
        if (page.number !== undefined && page.number !== null) {
            skip = parseInt(page.number * 10)
        }
    }

    if(object !== undefined && object !== null && object.sort !== undefined && object.sort !== null){
        sort=object.sort
    }

    return db.collection(entity).find(search).sort(sort).skip(skip).limit(limit).toArray()
}

const findOne = (entity, db, id) => {
    return db.collection(entity).findOne({_id: new ObjectId(id)})
}

const create = (entity, db, object) => {
    return db.collection(entity).insertOne(object)
}

const update = (entity, db, object, id) => {
    return db.collection(entity).findOneAndUpdate({_id: new ObjectId(id)}, {$set: object}, {returnDocument: 'after'})
}

const deleteOne = (entity, db, id) => {
    return db.collection(entity).deleteOne({_id: new ObjectId(id)})
}

exports.crud = {
    findAll,
    findOne,
    create,
    update,
    deleteOne
}
