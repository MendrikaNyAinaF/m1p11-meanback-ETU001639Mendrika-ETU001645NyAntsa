const {sendError} = require("../utilities/response");
const {ObjectId} = require("mongodb");
const {convertObjectId} = require("../utilities/objectId");
const {convertToDate} = require("../utilities/date");
const findAll = (entity, db, object) => {
    let search = {}
    let page = {}
    let limit = 10000000
    let skip = 0

    object = convertObjectId(object)
    object = convertToDate(object)

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

    console.log('all', JSON.stringify(search), skip, limit)


    return db.collection(entity).find(search).skip(skip).limit(limit).toArray()
}

const findOne = (entity, db, id) => {
    return db.collection(entity).findOne({_id: new ObjectId(id)})
}

const create = (entity, db, object) => {
    object = convertObjectId(object)
    object = convertToDate(object)
    return db.collection(entity).insertOne(object)
}

const update = (entity, db, object, id) => {
    object = convertObjectId(object)
    object = convertToDate(object)
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