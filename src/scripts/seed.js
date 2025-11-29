import dotenv from 'dotenv';

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import { usersSeed, eventsSeed } from '../data/seedData.js';

dotenv.config({ path: '.env.local' });

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Event.deleteMany();

    const [organizer] = await User.create(usersSeed);
    const eventPayload = eventsSeed.map((event) => ({
      ...event,
      organizer: organizer._id,
    }));
    await Event.create(eventPayload);

    // eslint-disable-next-line no-console
    console.log('Seed data inserted');
    process.exit(0);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  }
};

seed();

