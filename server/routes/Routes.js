const express = require('express');

const router = express.Router();

const { createStudent, createMentor, assignMentorToStudent, assignStudentsToMentor, getStudentsOfMentor} = require('../controller/Controller');
router.post('/createstudent',  createStudent);
router.post('/assignstudents/:mentorid', assignStudentsToMentor);
router.post('/assignmentor/:studentid', assignMentorToStudent);
router.get('/getallstudents/:id', getStudentsOfMentor);
router.post('/creatementor', createMentor);

module.exports = router;