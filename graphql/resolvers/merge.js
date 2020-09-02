const User = require("../../models/User");
const Event = require("../../models/Event");

const { dateToString } = require("../../helpers/date");

// transform data
const transformBooking = (booking) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
  };
};
const transformEvent = (event) => {
  return {
    ...event._doc,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
  };
};

// deep nested func
const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      createdEvents: events.bind(this, user._doc.createdEvents),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const singleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return transformEvent(event);
  } catch (err) {
    throw err;
  }
};

const events = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((event) => {
      return transformEvent(event);
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;

// exports.user = user;
// exports.singleEvent = singleEvent;
// exports.events = events;

// function for deep nesting query - THEN - CATCH
// const events = (eventIds) => {
//   return Event.find({ _id: { $in: eventIds } })
//     .then((events) => {
//       return events.map((event) => {
//         return {
//           ...event._doc,
//           date: new Date(event._doc.date).toISOString(),
//           creator: user.bind(this, event._doc.creator),
//         };
//       });
//     })
//     .catch((err) => {
//       throw err;
//     });
// };

// const user = (userId) => {
//   return User.findById(userId)
//     .then((user) => {
//       return {
//         ...user._doc,
//         createdEvents: events.bind(this, user._doc.createdEvents),
//       };
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
