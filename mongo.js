const mongoose = require('mongoose');

mongoose.set('strictQuery',false);

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.izoedye.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length < 5) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
    })
    mongoose.connection.close();
  })
}

if (process.argv.length === 5) {
  const newName = process.argv[3];
  const newNumber = process.argv[4];

  const newPerson = new Person({
    name: newName,
    number: newNumber
  });

  newPerson.save().then(result => {
    console.log(`added ${newName} number ${newNumber} to phonebook`);
    mongoose.connection.close();
  })
}
