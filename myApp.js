require("dotenv").config();

const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Encountered an error:" + err.message);
  });

let Schema = mongoose.Schema;

let personSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    $gt: 1,
    $lt: 120,
  },
  favoriteFoods: [String],
});

let Person = mongoose.model("Person", personSchema);

const createAndSavePerson = (done) => {
  let user = new Person({
    name: "George",
    age: 119,
    favoriteFoods: ["Burgers", "Fries"],
  });
  user.save((err, data) => {
    if (err) {
      console.error("Error saving user: ", err.message);
      return done(err);
    }
    return done(null, data);
  });
};

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    return done(null, data);
  });
};

const findPersonById = (personId, done) => {
  Person.findById({ _id: personId }, (err, data) => {
    if (err) return done("An error occured:", err.message);
    return done(null, data);
  });
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";

  Person.findById({ _id: personId }, (err, data) => {
    if (err) return done("There was a problem: ", err.message);
    data.favoriteFoods.push(foodToAdd);
    data.save((err, data) => {
      if (err) return done("There was a problem: ", err.message);
      return done(null, data);
    });
  });
};
const findAndUpdate = (personName, done) => {
  const ageToSet = 20;

  Person.findOneAndUpdate(
    { name: personName },
    { age: ageToSet }, // Specify the update here
    { new: true }, // Options: return the updated document
    (err, updatedPerson) => {
      if (err) {
        return done(err);
      }
      return done(null, updatedPerson);
    }
  );
};

const removeById = (personId, done) => {
  Person.findByIdAndDelete({ _id: personId }, (err, data) => {
    if (err) return done("There was an error:", err.message);
    return done(null, data);
  });
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";

  Person.remove( { name: nameToRemove }, (err, data) =>{
    if(err) return done('There was a problem: ', err.message)
    return done(null, data)
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";

  Person.find( { favoriteFoods: foodToSearch })
  .sort( { name: 1 })
  .limit(2)
  .select({ age: 0 })
  .exec((err, data) =>{
    if(err) return done('An error occured', err.message)
  return done(null, data)
  })
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
