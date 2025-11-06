
import React from 'react';

const Logo: React.FC<{
  containerClassName?: string;
  iconClassName?: string;
  textClassName?: string;
}> = ({
  containerClassName = '',
  iconClassName = 'w-10 h-10',
  textClassName = 'text-3xl'
}) => {
  return (
    <div className={`flex items-center space-x-3 ${containerClassName}`}>
      <div className={`relative ${iconClassName} flex-shrink-0`}>
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g className="text-accent-red" fill="currentColor">
                <path d="M12 0H20V12H32V20H20V32H12V20H0V12H12V0Z"/>
                {/* Updated small shape to be a cross */}
                <path d="M25 2H27V4H29V6H27V8H25V6H23V4H25V2Z"/>
            </g>
            {/* New hand paths to look more like the provided logo */}
            <g fill="white" transform="translate(1, 2)">
              <path d="M15.4,20.8c-1.5-0.3-2.9,0.5-3.6,1.8c-0.6,1.1-0.6,2.5,0.1,3.6c0.7,1.2,2,1.9,3.4,1.9c1.1,0,2.1-0.5,2.9-1.3 c1-1,1.5-2.3,1.5-3.7c0-1.7-0.8-3.3-2.2-4.2C17.1,20.3,16.2,20.4,15.4,20.8z"/>
              <path d="M11.6,12.7c0.8-0.9,1.9-1.5,3.1-1.6c1.7-0.1,3.4,0.8,4.3,2.3c0.9,1.5,1,3.4-0.2,5c-1,1.3-2.6,2.1-4.3,2.1 c-1.4,0-2.8-0.6-3.8-1.7C9.7,18.8,9.5,16.8,10.3,15C10.6,14.1,11,13.3,11.6,12.7z"/>
            </g>
        </svg>
      </div>
      <span className={`${textClassName} font-display font-bold text-slate-800`}>MEDIFY</span>
    </div>
  );
};

export default Logo;
