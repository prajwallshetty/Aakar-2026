import React from 'react';

const GlimpseOfAakar = () => {
  return (
    <div className="absolute top-250 left-1/2 -translate-x-1/2 h-40 rounded-md animate-pulse">
      
      <div className="w-full text-white py-16 px-6 text-center flex flex-col md:flex-row items-center justify-center gap-8 rounded-lg">
        
        
        <h2 className="text-4xl font-bold uppercase tracking-wide text-white">
          <div>
            Glimpse of<br/>
            Aakar 2024
          </div>
        </h2>

     
        <video 
          className="w-[90px] h-[100px] md:w-[200px] md:h-[150px] lg:w-[350px] lg:h-[200px] rounded-lg ml-24"
          autoPlay
          loop
          muted
          controls
        >
          <source src="/glimpse.mp4" type="video/mp4" />
        </video>

      </div> 
      
    </div>
  );
};

export default GlimpseOfAakar;
