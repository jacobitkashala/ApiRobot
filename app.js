const fetch = require("node-fetch");
const { check, oneOf, validationResult } = require('express-validator');
const cors = require("cors");
const express = require("express");
const app = express();

let robotDataAll = [{ image: "" }];
let robotDataCurrent = [];

app.use(Cors({
    origin: ["http://localhost:3000"],
    method: ["GET", "PUT", "POST", "DELETE"],
    Credential: true
}))

app.use((req, resp, next) => {
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'OPTOINS, GET, POST, DELETE, PUT');
    resp.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(express.json());
// route(app);
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
    console.log(id);
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
        .json({ message: 'API Robots' })
});
app.get('/api/robots', (req, res) => {
    res
        .status(200)
        .json(robotDataCurrent)
});
app.get("/api/robot/:id", (req, res) => {
    const { id } = req.params
    const robotIdFound = robotDataCurrent.some(robot => robot.id === parseInt(id))
    if (robotIdFound) {
        const robot = robotDataCurrent.find((student) => student.id === parseInt(id));
        res
            .status(200)
            .json(robot);
    } else {
        res
            .status(200)
            .json({ message: 'le robot n est pas trouvé' });
    }
})

app.post("/api/robot",
    check('name').isAlpha(),
    check('name').exists(),
    check('username').isAlpha(),
    check('username').exists(),
    check('email').exists(),
    check('email').isEmail(),

    (req, res) => {
        const newRobot = {};

        try {
            validationResult(req).throw();
            const { name, username, email } = req.body;
            // console.log(name, username, email);
            newRobot.name = name;
            newRobot.username = username;
            newRobot.email = email;
            newRobot.id = robotDataCurrent.length;
            newRobot.address = {
                "street": "Dayna Park",
                "suite": "Suite 449",
                "city": "Bartholomebury",
                "zipcode": "76495-3109",
                "geo": {
                    "lat": "24.6463",
                    "lng": "-168.8889"
                }
            };
            newRobot.phone = "(775)976-6794 x41206";
            newRobot.website = "conrad.com";
            newRobot.company = {
                "name": "Yost and Sons",
                "catchPhrase": "Switchable contextually-based project",
                "bs": "aggregate real-time technologies"
            };
            newRobot.image = "https://robohash.org/" + robotDataCurrent.length;

            robotDataCurrent.push(newRobot);

            res
                .status(200)
                .json(robotDataCurrent.reverse());

        } catch (err) {
            res.status(400).json(err);
        }
    })


app.listen(PORT, () => {
    console.log(`Our server is listening on the ${PORT} port`);
});