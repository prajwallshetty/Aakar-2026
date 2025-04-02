import React from 'react';
import Link from 'next/link';
import Eventdescription from './desc/eventdescription';
const Eventpage = () => {
  const events = [
    { id: 1, image: '/events/event2.jpg' },
    { id: 2, image: '/events/event2.jpg' },
    { id: 3, image: '/events/event2.jpg' },
    { id: 4, image: '/events/event2.jpg' },
    { id: 5, image: '/events/event2.jpg' },
    { id: 6, image: '/events/event2.jpg' },
    { id: 7, image: '/events/event2.jpg' },
    { id: 8, image: '/events/event2.jpg' },
  ];

  return (
    <div className="min-h-screen text-black p-15 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold text-white mb-12">TECHNICAL EVENTS</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <Link  href='events/desc' key={event.id}>
            <div
              className="relative bg-white rounded-4xl p-6 text-center flex flex-col items-center h-100 w-90 bg-cover bg-center cursor-pointer transition-transform "
              style={{
                backgroundImage: `url('${event.image}')`,
              }}
            >
              <div
                className="w-30 h-35 bg-contain bg-no-repeat absolute bottom-2 right-[-40]"
                style={{
                  backgroundImage: `url('/eventcard-ch${(index % 3) + 1}.png')`,
                }}
              ></div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Eventpage;
