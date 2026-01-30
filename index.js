const express = require('express');
app = express();
const morgan = require('morgan');
const cors = require('cors');

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

let persons = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const numOfPeople = persons.length;
  const timeReceived = new Date().toString();

  response.send(`Phonebook has info for ${numOfPeople} people <br /> ${timeReceived}`);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find(p => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.statusMessage = `Couldn't find the person you are looking for with id "${id}"`;
    response.status(404).end();
  }
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

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const newPerson = {
    id: String(generateID()),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
