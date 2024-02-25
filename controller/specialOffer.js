const { ObjectId } = require("mongodb");
const { sendError } = require('../utilities/response')
const { notificationService } = require('../service/notification/notification')
const findCurrentsSpecialOffer = (req, res) => {
     const db = req.db;
     const currentDate = new Date();
     db.collection("offre_special")
          .find({ date_debut: { $lte: currentDate }, date_fin: { $gte: currentDate } })
          .sort({ date_debut: -1 })
          .toArray().then((result) => {
               res.status(200).send(result);
          }).catch(error => sendError(res, error, 500));
}

const createSpecialOffer = (req, res) => {
     const db = req.db;
     const offre = req.body;
     db.collection("offre_special").insertOne(offre).then((result) => {
          try {
               notificationService.specialOfferNotification(result, db);
          } catch (e) {
               console.error(e);
          }
          res.status(201).send(result);
     }).catch(error => sendError(res, error, 500));
}

module.exports = {
     findCurrentsSpecialOffer,
     createSpecialOffer
}
