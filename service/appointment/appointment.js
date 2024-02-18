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

const update = async (req, res) => {
    const id = req.params.id;
    const db = req.db;
    let body = req.body;
    if (body === undefined || body === null) return sendError(res, 'No body', 500);
    if (body.interval === undefined || body.interval === null) return sendError(res, 'No interval', 500);
    let interval = body.interval;

    let appointment = await crud.findOne('rendez_vous', db, id)
//  add interval to appointment date_heure_debut and date_heure_fin
    appointment.date_heure_debut = new Date(appointment.date_heure_debut.getTime() + interval);
    appointment.date_heure_fin = new Date(appointment.date_heure_fin.getTime() + interval);


//     get the details of the appointment
    let details = await db.collection('detail_rendez_vous').find({rendez_vous: new ObjectId(id)}).toArray()
//     add interval to the date_heure_debut and date_heure_fin of each detail
    details.map(detail => {
            let unit_date_heure_debut = new Date(detail.date_heure_debut);
            let unit_date_heure_fin = new Date(detail.date_heure_fin);
            detail.date_heure_debut = new Date(unit_date_heure_debut.getTime() + interval);
            detail.date_heure_fin = new Date(unit_date_heure_fin.getTime() + interval);
        }
    )

    await details.map(async detail => {
            let search_pattern = {
                "$and": [
                    {
                        "$or": [
                            {
                                "$and": [
                                    {
                                        date_heure_debut: {"$lte": detail.date_heure_debut}
                                    },
                                    {
                                        date_heure_fin: {"$gte": detail.date_heure_debut}
                                    },
                                ]
                            },
                            {
                                "$and": [
                                    {
                                        date_heure_debut: {"$lte": detail.date_heure_fin}
                                    },
                                    {
                                        date_heure_fin: {"$gte": detail.date_heure_fin}
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        employee: detail.employee
                    },
                    {
                        rendez_vous: {"$ne": new ObjectId(id)}
                    }
                ]
            }
            let availableDetail = await db.collection('detail_rendez_vous').find(search_pattern).toArray()
            console.log('availableDetail', availableDetail, availableDetail.length > 0)
            if (availableDetail.length === 0) {
                console.log('update detail', appointment, detail)
                let session = req.clientdb.startSession();
                session.withTransaction(
                    async () => {
                        await crud.update('rendez_vous', db, appointment, id)
                        await details.map(detail => {
                                crud.update('detail_rendez_vous', db, detail, detail._id)
                            }
                        )
                        res.send({
                            code: 200,
                            message: "Appointment updated",
                            data: appointment
                        });
                    }
                ).catch(error => {
                        sendError(res, error, 500)
                    }
                )
            } else {
                sendError(res, 'Not available', 500)
            }
        }
    )
}

exports.appointmentServiceCrud = {
    create,
    cancel,
    update
}