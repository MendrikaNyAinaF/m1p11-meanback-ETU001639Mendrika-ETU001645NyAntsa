const { checkFormatHour, compareHours } = require("../utilities/formatCheck")
const { sendError } = require("../utilities/response");

/* employe/id/schedule post */
const insertNewSchedule = async (req, res) => {
     const db = req.db;
     const id = req.path.split("/")[1];

     const body = req.body;
     if (!checkFormatHour(body.heure_debut) || !checkFormatHour(body.heure_fin)) sendError(res, "Format de heure non valide", 500)
     if (compareHours(body.heure_debut, body.heure_fin) >= 0) sendError(res, "Les heures ne sont pas cohérentes", 500)
     const date = new Date();

     try {
          const session = req.clientdb.startSession();
          session.startTransaction();

          // get the current schedule and modify it
          const currentSchedule = await db.collection("horaire_travail").findOne({ date_fin: null, employee: id });
          await db.updateOne({_id:currentSchedule._id},{$set:{date_fin:date}});

          //insert the new schedule
          const newSchedule = {
               employee: id,
               heure_debut: body.heure_debut,
               heure_fin: body.heure_fin,
               date_debut: date,
               date_fin: null
          }
          await db.collection("horaire_travail").insertOne(newSchedule);

          session.commitTransaction();
          res.send({
               code: 201,
               message: "Le nouvel horaire a été enregistré avec succès",
               data: result
          });
     } catch (error) {
          sendError(res, error, 500)
     }

}
module.exports = {
     insertNewSchedule
}
