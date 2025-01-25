"use client"; 
import "../../app/globals.css";


import React, { useState, useEffect } from 'react';
import Card from './Card';
import Header from '../Components/Header';

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
interface perform {
  Name: string
}


export default function Page() {
  const [pos, setPos] = useState<posexcel[]>([]); // Array of jobs
  const [perf, setPerf] = useState<perform[]>([]);

  const [selectedPo, setSelectedPo] = useState<posexcel[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('https://constructapi.vercel.app/po');
        const data = await response.json();

        // Handle potential errors in the fetched data
        if (!Array.isArray(data)) {
          console.error('Error: Expected jobs data to be an array');
          return; // Exit early if data is not an array
        }

        setPos(data);
      } catch (error) {
        console.error('Error al obtener las PO:', error);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const response = await fetch('https://constructapi.vercel.app/performed');
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

        setPerf(data);
      } catch (error) {
        console.error('Error al obtener las PO:', error);
      }
    };

    fetchPerf();
  }, []);

  const handlePOSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPoId = event.target.value.toLowerCase();
  
    const selectedPo = pos.filter(po => po.PerformedBy?.toLowerCase() === selectedPoId);
    setSelectedPo(selectedPo);
  };
    
 


  return (
    <div className='w-full mx-auto px-4'>
      <div>
        <Header />
      </div>
      <hr />
      <select onChange={handlePOSelect} className='block mb-2 text-base font-medium text-gray-900 dark:text-white'>
        <option value="">Choose a contractor</option>
        {perf.map((po) => (
          <option key={po.Name} value={po.Name}>
            {po.Name}
          </option>
        ))}
      </select>
      
      <hr />
      <Card selectedPo ={selectedPo} />
    </div>
  );
}