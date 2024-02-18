const {convertObjectId} = require("../../utilities/objectId");
const {convertToDate} = require("../../utilities/date");
const {ObjectId} = require('mongodb');
const {sendError} = require("../../utilities/response");

const create = async (req, res) => {
    const db = req.db;

    let body = req.body;
    if (body === undefined || body === null) {
        res.status(400).send('Body is required');
        return;
    } else if (body.client == undefined || body.client == null) {
        res.status(400).send('Client is required');
        return;
    } else if (body.date_heure_debut == undefined || body.date_heure_debut == null) {
        res.status(400).send('Date and time are required');
        return;
    } else if (body.details == undefined || body.details == null) {
        res.status(400).send('Details are required');
        return;
    }

    body = convertObjectId(body);
    body = convertToDate(body);
    console.log('create appointment', body);

    let appointment = {
        client: body.client,
        status: new ObjectId('65c23d803fe8b2bd4b8f7e0d'),
        date_heure_debut: body.date_heure_debut,
    }

    let startDate= new Date(appointment.date_heure_debut);

    let appointmentDetails = body.details
    // for each details retrieve the service from the database
    for (let i = 0; i < appointmentDetails.length; i++) {
        const result = await db.collection('service').findOne({_id: appointmentDetails[i].service});
        if (result === null) {
            sendError(res, 'Service not found', 500);
            return;
        }
        appointmentDetails[i].service = result;
        appointmentDetails[i].prix= result.prix;
        appointmentDetails[i].date_heure_debut= startDate;
        startDate= new Date(startDate.getTime() + result.duree * 60000);
        appointmentDetails[i].date_heure_fin= startDate;
    }

    let sumDuree = 0;
    let sumPrix = 0;
    for (let i = 0; i < appointmentDetails.length; i++) {
        sumDuree += appointmentDetails[i].service.duree;
        sumPrix += appointmentDetails[i].service.prix;
    }

    appointment.date_heure_fin= new Date(appointment.date_heure_debut.getTime() + sumDuree * 60000);
    appointment.prix = sumPrix;
    appointment.details = appointmentDetails;
    console.log('appointment', appointment);

    // check availability of the

    res.send('create appointment');
}

exports.appointmentServiceCrud = {
    create
}