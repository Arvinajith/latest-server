export const usersSeed = [
  {
    name: 'Olivia Organizer',
    email: 'olivia@events.com',
    password: 'Password123',
    role: 'organizer',
  },
  {
    name: 'Adam Admin',
    email: 'adam@events.com',
    password: 'Password123',
    role: 'admin',
  },
  {
    name: 'Tina Attendee',
    email: 'tina@events.com',
    password: 'Password123',
    role: 'attendee',
  },
];

export const eventsSeed = [
  {
    title: 'Future of Fintech 2025',
    slug: 'future-of-fintech-2025',
    description: 'Premium summit exploring fintech, AI, and compliance.',
    category: 'Finance',
    tags: ['fintech', 'ai'],
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 4),
    location: {
      address: '123 Innovation Dr',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
    },
    status: 'published',
    capacity: 500,
    pricing: [
      { tier: 'general', label: 'General Admission', price: 199 },
      { tier: 'vip', label: 'VIP', price: 499 },
    ],
  },
];

