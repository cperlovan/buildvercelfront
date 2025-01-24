"use client";

import React from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';

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
    selectedBi: Billsexcel[];
}

// interface TableColumn<T> {
//     name: string;
//     selector: (row: T) => string | number | Date; // Define el tipo de retorno del selector
//     sortable: boolean;
//   }


const columns: TableColumn<Billsexcel>[] = [
    {
        name: 'Job',
        selector: (row: Billsexcel) => row.Job,
        sortable: true,
    },
    {
        name: 'Bill',
        selector: (row: Billsexcel) => row.Bill,
        sortable: true,
    },
    {
        name: 'Status',
        selector: (row: Billsexcel) => row.BillStatus,
        sortable: true,
    },
    {
        name: 'Amount',
        selector: (row: Billsexcel) => row.BillAmount,
        sortable: true,

    },
    {
        name: 'Date Paid',
        selector: (row: Billsexcel) => {
            if (row.DatePaid) {
                const dateString = row.DatePaid.toString().trim(); // Trim the string before creating the Date object
                const date = new Date(dateString);
                if (isNaN(date)) {
                    return "Invalid Date";
                } else {
                    return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                }
            } else {
                return "";
            }
        },
        sortable: true,
    }
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