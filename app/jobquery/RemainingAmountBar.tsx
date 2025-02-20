import React from 'react';

interface RemainingAmountBarProps {
    jobRunningTotal: number;
    totalCosts: number;
   
}

const RemainingAmountBar: React.FC<RemainingAmountBarProps> = ({
    jobRunningTotal,
    totalCosts,
    
}) => {
    if (!jobRunningTotal) return null;

    // Calcular el monto restante
    const remainingAmount = jobRunningTotal - totalCosts;

    // El 70% del jobRunningTotal es el 100% de lo que se debe gastar
    const maxSpending = jobRunningTotal * 0.7;

    // Calcular el porcentaje basado en el maxSpending
    const percentage = (remainingAmount / maxSpending) * 100;

    let barColor = 'bg-success'; // Valor predeterminado

    if (percentage < 25) {
        barColor = 'bg-danger'; // Si el porcentaje es menor al 25%, usa rojo
    } else if (percentage < 30) {
        barColor = 'bg-warning'; // Si el porcentaje es menor al 30%, usa amarillo
    }

    const formatNumber = (number: number | bigint) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    };

    return (
        <div>
            <div className="progress">
                <div
                    className={`progress-bar ${barColor}`}
                    role="progressbar"
                    style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
                    aria-valuenow={percentage}
                >
                    {formatNumber(remainingAmount)} ({percentage.toFixed(2)}%) remaining
                </div>
            </div>
        </div>
    );
};

export default RemainingAmountBar;