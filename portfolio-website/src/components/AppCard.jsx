import React from 'react';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

const AppCard = ({ title, description, status, icon: Icon, link }) => {
  const isLive = status === 'live';
  const statusText = isLive ? 'Available Now' : 'Testing';
  const buttonText = isLive ? 'Download' : 'Request Access';

  const statusClasses = clsx(
    'text-xs px-2 py-1 rounded-full border',
    {
      'bg-green-900/50 text-green-400 border-green-500/30': isLive,
      'bg-blue-900/50 text-blue-400 border-blue-500/30': !isLive,
    }
  );

  return (
    <div className="col-span-1 md:col-span-1 bg-neutral-900 rounded-3xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-300">
      <div className="flex justify-between items-start">
        {Icon && (
          <div className={clsx(
            "w-12 h-12 rounded-full flex items-center justify-center",
            {
              "bg-green-500/20 text-green-400": isLive,
              "bg-blue-500/20 text-blue-400": !isLive,
            }
          )}>
            <Icon className="w-6 h-6" />
          </div>
        )}
        <span className={statusClasses}>{statusText}</span>
      </div>
      <div>
        <h3 className="text-xl font-bold text-gray-100 mb-1">{title}</h3>
        <p className="text-gray-400 text-sm mb-4">{description}</p>
        <button
          className={clsx(
            "w-full py-2 rounded-lg font-semibold transition-colors",
            {
              "bg-white text-gray-900 hover:bg-gray-200": isLive,
              "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600": !isLive,
            }
          )}
          onClick={() => link && window.open(link, '_blank')}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default AppCard;
