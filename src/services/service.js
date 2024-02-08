var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ServiceSchema = new Schema({
     _id: {type: Schema.Types.ObjectId},
     nom: {type: String, required: true},
     prix: {type: Number, required: true},
     commission: {type: Number, required: true},
     description: {type: String},
     status: {type: boolean, required: true, default:true},
     photo: {type: String},
});
