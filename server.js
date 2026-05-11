const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
/*const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');*/

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const questions = require("./questions.js");

app.use(express.json());
app.use(express.static(__dirname));

/*const port = new SerialPort({
  path: 'COM3',
  baudRate: 9600
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));


parser.on('data', (line) => {
  console.log('Received:', line);

  const parts = line.split(',');

  if (parts.length < 2) {
    console.log('Invalid serial data');
    return;
  }

  currentSensor = parts[0];
  currentUID = parts[1];

  console.log('Sensor:', currentSensor);
  console.log('UID:', currentUID);

  io.emit('answer-detected', {
    sensor: currentSensor,
    uid: currentUID
  });
});*/
let currentSensor = null;
let currentUID = null;

io.on("connection", (socket) => {
  console.log("client connected");

  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

app.post("/rfid-answer", (req, res) => {
  const { sensor, uid } = req.body;

  if (!sensor || !uid) {
    return res.status(400).json({ message: "sensor and uid are required" });
  }

  currentSensor = sensor;
  currentUID = uid;

  console.log("Sensor:", currentSensor);
  console.log("UID:", currentUID);

  io.emit("answer-detected", {
    sensor: currentSensor,
    uid: currentUID,
  });

  res.json({
    message: "Answer received",
    sensor: currentSensor,
    uid: currentUID,
  });
});

app.get("/hello", (req, res) => {
  res.json({ message: "Server is running!" });
});

app.get("/questions/:level/:subject", (req, res) => {
  const { level, subject } = req.params;

  const allQuestions = questions[level][subject];
  let sentQuestions = [];

  function letterArrays(letter) {
    let num = 0;
    let lettersList = [];
    while (num < allQuestions.length) {
      if (allQuestions[num].answer === letter) {
        lettersList.push(allQuestions[num]);
      }
      num++;
    }
    return lettersList;
  }

  let theLetters = ["A", "B", "C", "D"];

  for (let i = 0; i < 4; i++) {
    let letterQuestions = letterArrays(theLetters[i]);
    let randomIndex = Math.floor(Math.random() * letterQuestions.length);
    sentQuestions.push(letterQuestions[randomIndex]);
  }

  let tempLetters = [];
  for (let i = 0; i < 4; i++) {
    let letterQuestions = letterArrays(theLetters[i]);
    let randomIndex = Math.floor(Math.random() * letterQuestions.length);

    if (sentQuestions.includes(letterQuestions[randomIndex])) {
      if (randomIndex >= 0 && randomIndex < letterQuestions.length - 1) {
        randomIndex += 1;
      } else {
        randomIndex -= 1;
      }
    }

    tempLetters.push(letterQuestions[randomIndex]);
  }

  let randomIndex = Math.floor(Math.random() * tempLetters.length);
  tempLetters.splice(randomIndex, 1);

  for (let i = 0; i < sentQuestions.length; i++) {
    let randomIndex = Math.floor(Math.random() * sentQuestions.length);
    [sentQuestions[i], sentQuestions[randomIndex]] = [
      sentQuestions[randomIndex],
      sentQuestions[i],
    ];
  }

  for (let i = 0; i < tempLetters.length; i++) {
    let randomIndex = Math.floor(Math.random() * sentQuestions.length);
    [sentQuestions[i], sentQuestions[randomIndex]] = [
      sentQuestions[randomIndex],
      sentQuestions[i],
    ];
  }

  let secondList = [];
  for (let i = 0; i < tempLetters.length; i++) {
    secondList.push(tempLetters[i].answer);
  }

  console.log(secondList);

  let repeatedList = theLetters.filter(
    (letter) => !secondList.includes(letter),
  );

  console.log("-----------hena--------");
  console.log(repeatedList);

  for (let i = 0; i < sentQuestions.length; i++) {
    if (sentQuestions[i].answer === repeatedList[0]) {
      console.log(sentQuestions[i].answer);
      [sentQuestions[3], sentQuestions[i]] = [
        sentQuestions[i],
        sentQuestions[3],
      ];
    }
  }

  sentQuestions.push(...tempLetters);
  console.log(sentQuestions);
  res.json(sentQuestions);
});

app.post("/reset-answer", (req, res) => {
  currentSensor = null;
  currentUID = null;

  res.json({
    sensor: currentSensor,
    uid: currentUID,
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
