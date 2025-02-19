import React from 'react';

interface RemainingAmountBarProps {
    remainingAmount: number;
    jobRunningTotal: number;
    totalCosts: number;
    costsOutstanding: number


}

const RemainingAmountBar: React.FC<RemainingAmountBarProps> = ({ remainingAmount, jobRunningTotal }) => {
    if (!jobRunningTotal) return null;

    const percentage = (remainingAmount / jobRunningTotal) * 100;
    let barColor = 'green'; // Valor predeterminado

    if (percentage < 0) {
        barColor = 'red'; // Si el monto restante es negativo, usa rojo
    } else if (percentage < 30) {
        barColor = 'yellow'; // Si el porcentaje es menor del 30%, usa amarillo
    }

    return (
        <div style={{ width: '100%', backgroundColor: '#f0f0f0', borderRadius: '5px', overflow: 'hidden' }}>
            <div
                style={{
                    width: `${Math.max(0, percentage)}%`, // Evita anchos negativos
                    height: '20px',
                    backgroundColor: barColor,
                    transition: 'width 0.3s ease-in-out',
                }}
            ></div>
            <div style={{ textAlign: 'center', marginTop: '5px' }}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(remainingAmount)} ({percentage.toFixed(2)}%)
            </div>
        </div>
    );
};
export default RemainingAmountBar;

