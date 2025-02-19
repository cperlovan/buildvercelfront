import React from 'react';

interface RemainingAmountBarProps {
    jobRunningTotal: number;
    totalCosts: number;
    costsOutstanding: number;
}

const RemainingAmountBar: React.FC<RemainingAmountBarProps> = ({
    jobRunningTotal,
    totalCosts,
    costsOutstanding,
}) => {
    if (!jobRunningTotal) return null;

    const remainingAmount = jobRunningTotal - (totalCosts + costsOutstanding);
    const percentage = (remainingAmount / jobRunningTotal) * 100;

    let barColor = 'bg-success'; // Valor predeterminado

    if (percentage < 0) {
        barColor = 'bg-danger'; // Si el monto restante es negativo, usa rojo
    } else if (percentage < 30) {
        barColor = 'bg-warning'; // Si el porcentaje es menor del 30%, usa amarillo
    } else if (percentage > 85) {
        barColor = 'bg-danger';
    } else if (percentage >= 70) {
        barColor = 'bg-warning';
    }

    const formatNumber = (number: number | bigint) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number);
    };

    return (
        <div>
            <div className="progress">
                <div
                    className={`progress-bar ${barColor}`} // Usar la misma variable barColor
                    role="progressbar"
                    style={{ width: `${Math.max(0, percentage)}%` }}
                    aria-valuenow={percentage}
                >
                    {formatNumber(remainingAmount)} ({percentage.toFixed(2)}%) remaining
                </div>
            </div>
        </div>
    );
};

export default RemainingAmountBar;