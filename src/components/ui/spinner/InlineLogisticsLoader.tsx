import React from 'react';
import './InlineLogisticsLoader.scss';

interface InlineLogisticsLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InlineLogisticsLoader: React.FC<InlineLogisticsLoaderProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  return (
    <div className={`inline-logistics-loader ${size} ${className}`}>
      {/* Mini Truck Animation */}
      <div className="mini-truck">
        <div className="mini-truck-body">
          <div className="mini-truck-cab"></div>
          <div className="mini-truck-trailer"></div>
        </div>
        <div className="mini-truck-wheels">
          <div className="mini-wheel mini-wheel-front"></div>
          <div className="mini-wheel mini-wheel-rear"></div>
        </div>
      </div>
    </div>
  );
};

export default InlineLogisticsLoader;
