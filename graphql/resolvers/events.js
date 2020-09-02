const { transformEvent } = require("./merge");
const Event = require("../../models/Event");
const User = require("../../models/User");

///// for rootValue
module.exports = {
  // fetch all events
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return transformEvent(event);
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  // create an event
  createEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: "5f4c2e2ee3bf1c1e08012b32",
    });

    let createdEvent;

    return event
      .save()
      .then((result) => {
        createdEvent = transformEvent(result);
        return User.findById("5f4c2e2ee3bf1c1e08012b32");
      })
      .then((user) => {
        if (!user) {
          throw new Error("User Not Found");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((result) => {
        return createdEvent;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  },
};
