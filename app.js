import fetch from "node-fetch";
import cors from "cors";
import express from "express"
import route from "./src/routes/robotRoute"
const app = express();
let robotDataAll = [{ image: "" }];
let robotDataCurrent = [];

app.use(express.json());
route(app);
const PORT = process.env.PORT || 8800;


(async function getRobots() {
    await fetch("https://jsonplaceholder.typicode.com/users")
        .then(data => {
            return data.json();
        })
        .then(robotsInfo => {
            for (const index in robotsInfo) {
                robotDataAll = [...robotsInfo];
                robotDataAll[index].image = "https://robohash.org/" + index;
            };
            robotDataCurrent = [...robotDataAll]
        })
})();


const toCheckValue = (reqtte) => {
    const { nom, prenom } = reqtte.body
    if (nom === "" || prenom === "") {
        return false
    } else return true
};

const toDeleteStudent = (req, resp) => {
    const { id } = req.params;
    const studentIdFound = students.some(Robot => Robot.id === parseInt(id))
    if (studentIdFound) {
        const studentsUpdate = filterBD(id);
        resp.json(studentsUpdate);

    } else {
        resp.status(404).json({ error: `No Robot id ${id}` })
        //  resp.send("<h1>404 error</h1>");
    }

};

const filterBD = (id) => {
    const robotsUpdate = students.filter((Robot) => Robot.id !== parseInt(id));
    return robotsUpdate;
}

const toInsertRobot = ({ nom, prenom }) => {
    const newRobot = {
        id: uuid.v4(),
        name: nom,
        lastName: prenom,
    };
    // students.push(newStudent);
    return newRobot;
}

const toUpdataStudent = (reqtte, resp) => {
    const { id } = reqtte.params;
    const studentIdFound = students.some(Robot => Robot.id === parseInt(id));
    let studentDelete = filterBD(id);

    if (studentIdFound) {
        const isEmpty = toCheckValue(reqtte);
        const newStudent = isEmpty ? toInsertStudent(reqtte.body) : (resp.status(404).json({ error: `Remplir tout le champs` }))
        studentDelete.push(newStudent);
        const studentUpdate = studentDelete;
        resp.json(studentUpdate);
    } else {
        resp.status(404).json({ error: `No Robot id ${id}` })
    }
}
app.get('/', (req, res) => {
    res
        .status(200)
        .json({message:'API Robots'})
});
app.get('/api/robots', (req, res) => {
    res
        .status(200)
        .json(robotDataCurrent)
});
app.get("/api/robot-users/:id", (req, res) => {
    const { id } = req.params
    const studentIdFound = robotDataCurrent.some(robot => robot.id === parseInt(id))
    if (studentIdFound) {
        const robot = students.find((student) => student.id == id);
    } else {
        //  resp.status(404).json({ error: `No student id ${id}` })

        res.send("<h1>404 error</h1>");
    }
    resp.json(robot);
})


app.listen(PORT, () => {
    console.log(`Our server is listening on the ${PORT} port`);
});