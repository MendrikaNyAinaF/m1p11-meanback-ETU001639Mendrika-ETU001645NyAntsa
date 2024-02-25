const {ObjectId} = require("mongodb");
const addStatutAppointmentMiddlewareForClient = async (req, res, next) => {
    console.log("body ",req.body);
    if(req.body.search!=undefined && req.body.search['$and']!=undefined){
        req.body.search['$and'].push({
            status :{
                "$ne": new ObjectId("65c23d5d3fe8b2bd4b8f7e0c")
            }
        })
    }else{
        req.body["search"] = {
            "$and": [
                {
                    status :{
                        "$ne": new ObjectId("65c23d5d3fe8b2bd4b8f7e0c")
                    }
                }
            ]
        }
    }
//     call next
    next()
}

exports.addStatutAppointmentMiddlewareForClient = addStatutAppointmentMiddlewareForClient;
