"use client";


import React from 'react';
import DataTable from 'react-data-table-component';

interface posexcel {
    Job: string;
    PO: string;
    Title: string;
    VarianceCode: string;
    CostCode: string;
    PerformedBy: string;
    EstComplete: string;
    POStatus: string;
    Comments: string;
    Paid: string;
    Cost: number;

}

interface CardProps {
    selectedPo: posexcel[] ;
}



const columns = [
	{
		name: 'Job',
		selector: (row: posexcel) => row.Job,
		sortable: true,
	},
	{
		name: 'P.O.',
		selector: (row: posexcel) =>  row.PO,
		sortable: true,
	},
	{
		name: 'Status',
		selector: (row: posexcel) =>  row.Paid,
		sortable: true,
	},
    {
		name: 'Cost',
		selector: (row: posexcel) =>  row.Cost,
		sortable: true,
        
	},
];
const Card: React.FC<CardProps> = ({ selectedPo }) => {
    return (
        <div className='w-full mx-auto px-4'>

            


            <DataTable 
            title="Purchase order Report"
            data={selectedPo}
            columns={columns}
            pagination
            responsive={true}
            
            />


        </div>
    );
};



export default Card;