import React from 'react';

const Page = () => {
  const events = [
    {
      id: 1,
      name: 'CODE DEBUGGING',
      date: '2025-04-10',
    },
    {
      id: 2,
      name: 'CODE DEBUGGING',
      date: '2025-04-12',
    },
    {
      id: 3,
      name: 'CODE DEBUGGING',
      date: '2025-04-15',
    },
    {
      id: 1,
      name: 'CODE DEBUGGING',
      date: '2025-04-15',
    },
    {
      id: 2,
      name: 'CODE DEBUGGING',
      date: '2025-04-15',
    },
    {
      id: 3,
      name: 'CODE DEBUGGING',
      date: '2025-04-15',
    },
  ];

  return (
    <div className="min-h-screen text-black flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-white mb-12">TECHNICAL EVENTS</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="relative bg-amber-50 rounded-lg p-6 text-center flex flex-col items-center h-72"
          >
            <h2 className="text-xl font-semibold mb-4">{event.name}</h2>
            <p className="text-black text-xs">{event.date}</p>
            {/* Dynamic background image positioned at the bottom right */}
            <div
              className="w-25 h-20 bg-contain bg-no-repeat absolute bottom-2 right-[-50]"
              style={{
                backgroundImage: `url('/eventcard-ch${event.id}.png')`,
              }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
