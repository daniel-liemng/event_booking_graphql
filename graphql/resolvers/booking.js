const { transformBooking, transformEvent } = require("./merge");
const Booking = require("../../models/Booking");
const Event = require("../../models/Event");

///// for rootValue
module.exports = {
  // fetch all bookings
  bookings: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    try {
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },
  // book an event
  bookEvent: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    const fetchedEvent = await Event.findOne({ _id: args.eventId });

    const booking = new Booking({
      user: "5f4b5b6d6d51ad3688a50286",
      event: fetchedEvent,
    });

    const result = await booking.save();
    return transformBooking(result);
  },
  // cancel booking
  cancelBooking: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("Unauthenticated!");
    }

    try {
      const booking = await Booking.findById(args.bookingId).populate("event");

      const event = transformEvent(booking.event);

      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  },
};
