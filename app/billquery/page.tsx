"use client"; 

import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useEffect } from 'react';
import Card from './Card';
import Header from '../Components/Header';

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
interface payto {
  Name: string
}


export default function Page() {
  const [bill, setBill] = useState<Billsexcel[]>([]); // Array of jobs
  const [pay, setPay] = useState<payto[]>([]);
  const [selectedbi, setSelectedBill] = useState<Billsexcel[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://constructapi.vercel.app/bills');
        const data = await response.json();
       
        // Handle potential errors in the fetched data
        if (!Array.isArray(data)) {
          console.error('Error: Expected bills data to be an array');
          return; // Exit early if data is not an array
        }

        setBill(data);
      } catch (error) {
        console.error('Error al obtener las bills:', error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchPayto = async () => {
      try {
        const response = await fetch('https://constructapi.vercel.app/payto');
        const data = await response.json();

        // Handle potential errors in the fetched data
        if (!Array.isArray(data)) {
          console.error('Error: Expected jobs data to be an array');
          return; // Exit early if data is not an array
        }

        data.sort((a, b) => {
          const nameA = a.Name.toLowerCase();
          const nameB = b.Name.toLowerCase();
          return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
        });

        setPay(data);
      } catch (error) {
        console.error('Error al obtener las PO:', error);
      }
    };

    fetchPayto();
  }, []);

  const handleBillSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedbiId = event.target.value.toLowerCase();
  
    const selectedBill = bill.filter(b => b.PayTo?.toLowerCase() === selectedbiId);
    setSelectedBill(selectedBill);
  };
    
 
  

  return (
    <div className='container-fluid'>
      <div>
  {/* Mostrar el ID del trabajo seleccionado */}
 
</div>
      <div>
        <Header />
      </div>
      <hr />
      <select onChange={handleBillSelect} className='jobselect'>
        <option value="">choose a contractor</option>
        {pay.map((po) => (
          <option key={po.Name} value={po.Name}>
            {po.Name}
          </option>
        ))}
      </select>
      
      <hr />
      <Card selectedBi ={selectedbi} />
    </div>
  );
}