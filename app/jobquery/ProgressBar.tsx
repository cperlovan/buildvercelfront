import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function ProgressBar({ totalCost, jobRunningTotal }) {
  const [progress, setProgress] = useState(0);

  const formatNumber = (number:  number | bigint)=>{
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
}

  // Calcula el porcentaje de progreso al cargar el componente
  useEffect(() => {
    let calculatedProgress = (totalCost / jobRunningTotal) * 100;
    
    setProgress(calculatedProgress);
  }, [totalCost, jobRunningTotal]);

 

  return (
    <div>
      <div className="progress">
        <div
          className={`progress-bar ${
            progress > 94 ? 'bg-danger' :
            progress >= 85 ? 'bg-warning' :
            'bg-success'
          }`}
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {formatNumber(progress)}% executed
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;