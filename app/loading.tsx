import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <img
        src="/load.gif"
        alt="Loading..."
        className="w-24 h-24"
      />
    </div>
  );
};

export default Loading;
