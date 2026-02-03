require('dotenv').config();
const Person = require('./models/person');

const express = require('express');
app = express();
const morgan = require('morgan');
const cors = require('cors');

app.use(express.static('dist'));
app.use(cors());
app.use(express.json());

morgan.token('body', (request, response) => JSON.stringify(request.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:", request.path);
  console.log("Body:", request.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then(persons => {
    const numOfPeople = persons.length;
    const timeReceived = new Date().toString();
    response.send(`Phonebook has info for ${numOfPeople} people <br /> ${timeReceived}`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  Person.findById(id).then((person) => {
    response.json(person);
  });

  // const person = persons.find(p => p.id === id);
  //
  // if (person) {
  //   response.json(person);
  //   response.statusMessage = `Couldn't find the person you are looking for with id "${id}"`;
  // } else {
  //   response.status(404).end();
  // }
});

const generateID = () => {
  const maxID = 5000;
  const newID = Math.floor(Math.random() * (maxID + 1)) + persons.length + 1;
  return newID;
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({ error: "Missing name" });
  }

  if (!body.number) {
    return response.status(400).json({ error: "Missing number" });
  }

  // if (persons.find(p => p.name === body.name)) {
  //   return response.status(400).json({ error: "name must be unique" });
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  });

  newPerson.save().then(savedPerson => {
    console.log(`The phone number and details for "${newPerson.name}" was saved!`);
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  persons = persons.filter((person) => person.id !== id);
  console.log(persons);
  response.status(200).json(persons); // returns an updated version of persons
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown Endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
