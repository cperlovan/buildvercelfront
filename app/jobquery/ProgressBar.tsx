import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ProgressBarProps {
  totalCost: number; // or number | bigint
  jobRunningTotal: number;
}

function ProgressBar({ totalCost, jobRunningTotal }: ProgressBarProps) {
  const [progress, setProgress] = useState(0);

  const formatNumber = (number: number | bigint) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
  };

  // Calcula el porcentaje de progreso al cargar el componente
  useEffect(() => {
    const calculatedProgress = totalCost > 0 ? (totalCost / jobRunningTotal) * 100 : 0;
    
    setProgress(calculatedProgress);
  }, [totalCost, jobRunningTotal]);

 

  return (
    <div>
      <div className="progress">
        <div
          className={`progress-bar ${
            progress > 80 ? 'bg-danger' :
            progress >= 70 ? 'bg-warning' :
            'bg-success'
          }`}
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
         
        >
          {formatNumber(progress)}% executed
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;