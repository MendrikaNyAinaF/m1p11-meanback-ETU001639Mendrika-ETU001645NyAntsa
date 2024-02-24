const {ObjectId} = require("mongodb");
const addStatutAppointmentMiddlewareForClient = async (req, res, next) => {
    req.body.search['$and'].push({
        status :{
            "$ne": new ObjectId("65c23d5d3fe8b2bd4b8f7e0c")
        }
    })
//     call next
    next()
}

exports.addStatutAppointmentMiddlewareForClient = addStatutAppointmentMiddlewareForClient;