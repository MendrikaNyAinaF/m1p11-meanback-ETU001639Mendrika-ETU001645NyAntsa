const {ObjectId} = require("mongodb");
const {sendError} = require('../utilities/response')

const findCurrentsSpecialOffer=(req,res)=>{
     const db = req.db;
     const currentDate=new Date();
     db.collection("offre_special")
          .find({date_debut:{$lte:currentDate},date_fin:{$gte:currentDate}})
          .sort({date_debut:-1})
          .toArray().then((result)=>{
          res.status(200).send(result);
     }).catch(error => sendError(res, error, 500));
}

module.exports={
     findCurrentsSpecialOffer
}
