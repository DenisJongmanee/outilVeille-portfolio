const { default: mongoose } = require('mongoose');
const Subject = require('../models/Subject');

exports.addSubject = (req, res, next) => {
    try {    
        const subject = req.body.subject;
        console.log(typeof(subject));
        Subject.find({ name: subject }).then((subjectResult) => {
            if (subjectResult.length === 0) {
                console.log("nouveau");
                const newSubject = new Subject({ name: subject });
                newSubject.save().then(() => res.status(200).send());
            } else {
                console.log("deja");
                res.status(201).send();
            }       
        });
    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}


exports.getSubjects = (req, res, next) => {
    try {   
        console.log("here");
        Subject.find().then(subjects => {
            console.log(subjects);
            res.status(200).json(subjects);    
        });
    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}

exports.getSubject = (req, res, next) => {
    try {
        const name = req.params.name;
        Subject.find({name: name}).then(subjects => {
            console.log(subjects.length === 0);
            if (subjects.length === 0) {
                return res.status(200).send();
            } else {
                return res.status(201).send();
            }
        });
    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}

exports.delSubject = (req, res, next) => {
    try {
        const subject = req.params.name;
        Subject.deleteOne({name: subject}).then(() => {
            res.status(200).send();
        }); 
    } catch(error) {
        console.log(error);
        res.status(400).send();
    }
}