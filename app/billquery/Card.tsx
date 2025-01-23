"use client";

import React from 'react';
import DataTable from 'react-data-table-component';

interface Billsexcel {
    Job: string;
    Bill: string;
    BillTitle: string;
    PayTo: string;
    BillAmount: number;
    InvoiceDate: Date;
    DueDate: Date;
    BillStatus: string;
    DatePaid: Date;
    PaidBy: string;
    CreatedDate: Date;
    Files: string;
    Comments: string;
    VarianceCodes: string;
    CostCodes: string;
    RelatedPOs: string;
    LienWaivers: string;
}

interface CardProps {
    selectedBi: Billsexcel[] ;
}



const columns = [
	{
		name: 'Job',
		selector: (row: { Job: any; }) => row.Job,
		sortable: true,
	},
	{
		name: 'Bill',
		selector: (row: { Bill: any; }) => row.Bill,
		sortable: true,
	},
	{
		name: 'Status',
		selector: (row: { BillStatus: any; }) => row.BillStatus,
		sortable: true,
	},
    {
		name: 'Amount',
		selector: (row: { BillAmount: any; }) => row.BillAmount,
		sortable: true,
        
	},
    {
		name: 'Date Paid',
		selector: (row: { DatePaid: any; }) => row.DatePaid,
		sortable: true,
        
	},
];
const Card: React.FC<CardProps> = ({ selectedBi }) => {
    return (
        <div className='container-fluid'>

            


            <DataTable 
            
            data={selectedBi}
            columns={columns}
            pagination
            responsive={true}
            
            />


        </div>
    );
};



export default Card;