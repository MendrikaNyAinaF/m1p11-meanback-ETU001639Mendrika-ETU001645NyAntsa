const { generateReferencePayment } = require('../service/util')
const { sendError } = require("../utilities/response");
const { ObjectId } = require('mongodb');

const collection = 'rendez_vous'

/* Payment for appointment
* @param {Object} req (body: mode_paiement), url with id of appointment
*/
const payAppointment = async (req, res) => {
     const id = req.path.split("/")[1];
     const db = req.db;

     const appointment = await db.collection(collection).findOne({ _id: new ObjectId(id) });
     if (appointment.status.code === 'TEP') return res.status(400).send('Payment already done');

     const mode_paiement = await db.collection('mode_paiement').findOne({ code: req.body.mode_paiement });
     if (!mode_paiement) return sendError(res, 'Status not found', 500);

     const status = await db.collection('status').findOne({ code: 'TEP' });
     if (!status) return sendError(res, 'Status not found', 500);

     try {
          const session = req.clientdb.startSession();
          session.startTransaction();
          /* change the status of the appointment to "terminé et payé" */
          await db.collection(collection).updateOne({ _id: new ObjectId(id) }, { $set: { status: status } });

          /* save the payment */
          await db.collection('paiement').insertOne(
               {
                    rendez_vous: id,
                    date_heure_paiement: new Date(),
                    mode_paiement: mode_paiement,
                    reference: generateReferencePayment(mode_paiement)
               });

          session.commitTransaction();
          res.send({
               code: 201,
               message: "Le paiement a été effectué avec succès",
               data: result
          });
     } catch (error) {
          sendError(res, error, 500)
     }
}

const findById = async (req, res) => {
     const id = req.path.split("/")[2];
     const db = req.db;
     // console.log(id);
     db.collection(collection).findOne({ _id: new ObjectId(id) }).then(async (result) => {
          if (result == null) return sendError(res, 'Appointment not found', 404);
          const services = await db.collection('rendez_vous_details').aggregate([
               {
                 $match: {
                    rendez_vous: new ObjectId( result._id )
                 }
               },
               {
                 $lookup: {
                   from: "service",
                   localField: "service",
                   foreignField: "_id",
                   as: "service"
                 }
               },
               {
                 $unwind: "$service"
               },
               {
                 $lookup: {
                   from: "personne",
                   localField: "employee",
                   foreignField: "_id",
                   as: "employee"
                 }
               },
               {
                 $unwind: "$employee"
               },
               {
                 $project: {
                   "service":"$service",
                   "employee":"$employee",
                   _id: 0
                 }
               }
             ]).toArray();
          result.services = services;
          res.status(200).json(result);
     }).catch((err) => {
          sendError(res, err, 500);
     });
}

exports.appointmentService = {
     payAppointment,
     findById
} 
