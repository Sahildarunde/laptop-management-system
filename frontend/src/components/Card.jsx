import React from 'react';

const Card = ({ title, subtitle, onClick }) => {
  return (
    <div
      className="bg-gradient-to-r from-[#4A00E0] to-[#8E2DE2] md:h-[150px] p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 hover:border-2 hover:border-slate-800 cursor-pointer "
      onClick={onClick}
    >
      <h3 className="md:text-3xl font-semibold text-white cursor-pointer ">{title}</h3>
      <p className="text-white mt-2 md:text-4xl cursor-pointer ">{subtitle}</p>
    </div>
  );
};

export default Card;
