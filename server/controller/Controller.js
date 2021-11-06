const mentorSchema = require('../models/Mentor')
const studentSchema = require('../models/Student')


const createStudent = async (req, res) => {
    try {
        console.log(req.body);
        const { id, name, place } = req.body;
        const student = new studentSchema({
            id,
            name,
            place,
        });
        console.log(student);
        const savedStudent= await student.save();
        console.log(savedStudent);
        res.json(savedStudent);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

const createMentor = async (req, res) => {
    try {
        console.log(req.body);
        const { id, name } = req.body;
        const mentor = new mentorSchema({
            id,
            name
        });
        console.log(mentor);
        const savedMentor= await mentor.save();
        console.log(savedMentor);
        res.json(savedMentor);
    }
    catch (err) {
        console.log(err);
        res.status(500).send();
    }
}

// assign a mentor to a student

const assignMentorToStudent  = async(req, res) => {
    try{
        console.log("Student id is ", req.params.studentid)
        const studentData = await studentSchema.find({ id: req.params.studentid });
        console.log("Student data !!", studentData)

        if(studentData.length==0)
        {
            throw "Student with this ID does not exist";
        }
        else
        {
            const mentorId = req.body.mentor_id;

            const mentorData = await mentorSchema.find({ id: mentorId });
            if(mentorData.length == 0)
                throw "Mentor with this ID does not exist";
        
            let updateDataForStudentSchema = {
                "name" : studentData[0].name,
                "id" : studentData[0].id,
                "place" : studentData[0].place,
                "mentor_id" : mentorId
             }

            let existingStudentsOfMentor = mentorData[0].students;
            let updateDataForMentorSchema = [];

            if(existingStudentsOfMentor.length == 0) // no students yet; so add the new student
             {
                updateDataForMentorSchema.push({
                    "student_id" : studentData[0].id,
                    "student_name" : studentData[0].name
                })
             }   
            
            
            const test = await studentSchema.findOneAndUpdate({ id: req.params.studentid },
                                    { $push: { updateDataForStudentSchema } });
                                res.status(201).json({ message: "Mentor assigned successfully" });

            await mentorSchema.findOneAndUpdate({ id: mentorId},
                                    {$push: {students : updateDataForMentorSchema}});
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

}


// assign a student or students to a mentor

const  assignStudentsToMentor = async(req, res) => {
    try{
        console.log("Mentor id is ", req.params.mentorid)
        const mentorData = await mentorSchema.find({ id: req.params.mentorid });
        console.log("Mentor data !!", mentorData)
        

        if(mentorData.length==0)
        {
            throw "Mentor with this ID does not exist";
        }
        else
        {
            const studentList = req.body.students;

            const existingStudentIds = []
            mentorData[0].students.forEach((each) => {
                if(existingStudentIds.indexOf(each.student_id)==-1)
                    existingStudentIds.push(each.student_id)
            });

            console.log("Existing Students!", existingStudentIds)


            let updateData = [];

            studentList.map((each) => {

                if(existingStudentIds.indexOf(each.student_id) == -1)
                    updateData.push({
                        "student_id" : each.student_id,
                        "student_name" : each.student_name
                    })

            })
            
            console.log(updateData)
            if(updateData.length == 0)
                res.status(200).json("Student(s) are already assigned to this mentor!")

            const test = await mentorSchema.findOneAndUpdate({ id: req.params.mentorid },
                                    { $push: { students: updateData } });
                                res.status(201).json({ message: "Student(s) assigned successfully" });

        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Mentor with this ID does not exist");
    }

}

// used to get all the folders/files for a specific user
const getStudentsOfMentor = async (req, res) => {
    try {
        const mentorData = await mentorSchema.find({ id: req.params.id });
        console.log(mentorData)
        if(mentorData.length!==0)
        {
            const studentsList = mentorData[0].students;
            
            console.log("List of students", studentsList);
            if(studentsList != undefined)
                res.json(studentsList);
            else
                res.json("No students are assigned to this mentor")
        }
        else
            throw "Mentor with this ID does not exist";

        
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}



module.exports = { createStudent, createMentor, assignStudentsToMentor, assignMentorToStudent, getStudentsOfMentor };