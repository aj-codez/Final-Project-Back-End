const {Schema, model} = require('mongoose');


const entrySchema = new Schema({
    post: {type: String, required: true, unique:false},
    content: {type: String, required: true},
    mood:{type: String,required: false},
    day:{type:Number},
    month:{type:Number},
    year:{type:Number},
    charcter:{type:String, required: false}
})
module.exports = model('Entries', entrySchema);