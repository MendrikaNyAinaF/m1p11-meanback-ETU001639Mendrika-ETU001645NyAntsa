/*
 de la forme depense post
*/
const insertDepense = async (req, res) => {
     const db = req.db;
     const body = req.body;

     //vérifier que le type de dépense existe
     db.collection("type_depense").findOne({ _id: body.type_depense }).then(async (result) => {
          if (result == null) sendError(res, "Le type de dépense n'existe pas", 500);
          var depense = null;

          //vérifier si la dépense existe déjà
          depense = await db.collection("depense").findOne({ type_depense: body.type_depense, annee_mois: body.annee_mois })

          if (depense == null) {
               db.collection("depense").updateOne({ _id: depense._id }, { $set: { montant: body.montant } }).then((result) => {
                    req.status(201).send(result);
               }).catch((error) => sendError(res, error, 500));
          } else {
               db.collection("depense").insertOne({
                    montant: body.amount,
                    type_depense: body.type_depense,
                    annee_mois: body.annee_mois
               }).then((result) => {
                    req.status(201).send({
                         code: 201,
                         message: "La dépense à été mise à jour",
                         data: result
                    });
               }).catch((error) => sendError(res, error, 500));
          }
     })

}

module.exports = {
     insertDepense
}
