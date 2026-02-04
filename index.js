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

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findById(id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        // response.statusMessage = "Couldn't find the person with that id :(";
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  const { number } = request.body;

  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }

      person.number = number;

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson);
      })
    })
    .catch(error => next(error));
})

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

app.delete("/api/persons/:id", (request, response, next) => {
  const id = request.params.id;

  Person.findByIdAndDelete(id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: "Unknown Endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id'});
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
