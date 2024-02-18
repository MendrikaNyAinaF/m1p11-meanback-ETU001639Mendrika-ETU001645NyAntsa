const {convertObjectId} = require("../../utilities/objectId");
const {convertToDate} = require("../../utilities/date");
const {ObjectId} = require('mongodb');
const {sendError} = require("../../utilities/response");
const {ignore} = require("nodemon/lib/rules");
const {crud} = require('../../service/crud')
const create = async (req, res) => {
    const clientdb = req.clientdb;
    let body = req.body;

    if (body === undefined || body === null) return sendError(res, 'No body', 500);
    if (body.appointment === undefined || body.appointment === null) return sendError(res, 'No appointment', 500);
    if (body.details === undefined || body.details === null) return sendError(res, 'No details', 500);

    body = convertObjectId(body);
    body = convertToDate(body);

    let createdAppointmentId = null;
    let session = null;
    session = clientdb.startSession();
    session.withTransaction(
        async () => {
            let result = await crud.create('rendez_vous', req.db, body.appointment);
            createdAppointmentId = result.ops[0]._id;

            await body.details.map(detail => {
                    detail.rendez_vous = createdAppointmentId;
                }
            )

            // await crud.create('rendez_vous_details', req.db, body.details)
            await req.db.collection('detail_rendez_vous').insertMany(body.details)
        }
    ).catch(error => {
            sendError(res, error, 500)
        }
    )

    console.log('All', body)

    res.send('create appointment');
}

const cancel = async (req, res) => {
    const id = req.params.id;
    const db = req.db;
    const status = new ObjectId("65c23d5d3fe8b2bd4b8f7e0c")
    let rendez_vous = await crud.findOne('rendez_vous', db, id)
    if (rendez_vous === null) return sendError(res, 'No appointment found', 500);
    rendez_vous.status = status;
    let result = await crud.update('rendez_vous', db, rendez_vous, id)
    res.send(result.value)
}

exports.appointmentServiceCrud = {
    create,
    cancel
}