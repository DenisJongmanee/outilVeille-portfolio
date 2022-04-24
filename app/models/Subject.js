const mongoose = require('mongoose');
const { Schema } = mongoose;


mongoose.connect('mongodb://localhost:27017/veille_db');

const SubjectSchema = new Schema ({
    name : String
}, { collection: 'subject', versionKey: false });

module.exports = mongoose.model('Subject', SubjectSchema);
