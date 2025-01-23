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
		selector: (row: { Job: any; }) => row.Job,
		sortable: true,
	},
	{
		name: 'P.O.',
		selector: (row: { PO: any; }) => row.PO,
		sortable: true,
	},
	{
		name: 'Status',
		selector: (row: { Paid: any; }) => row.Paid,
		sortable: true,
	},
    {
		name: 'Cost',
		selector: (row: { Cost: any; }) => row.Cost,
		sortable: true,
        
	},
];
const Card: React.FC<CardProps> = ({ selectedPo }) => {
    return (
        <div className='container-fluid'>

            


            <DataTable 
            
            data={selectedPo}
            columns={columns}
            pagination
            responsive={true}
            
            />


        </div>
    );
};



export default Card;