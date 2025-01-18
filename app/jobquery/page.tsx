"use client"; 

import React, { useState, useEffect } from 'react';
import Card from './Card';
import Header from '../Components/Header';

interface Jobsexcel {
  id:number;
  ContractPrice: number;
  CostsOutstanding: number;
  CostsPaid: number;
  JobRunningTotal: number;
  Name: string;
  AmountInvoiced: number;
  PaymentsReceived: number;
  ProjStart: Date; 
  ActualCompletion: Date;
  ActualStart: Date;
  ProjCompletion: Date;
  State: string;
  StreetAddress: string;
  TotalCosts: number;
}

export default function Page() {
  const [jobs, setJobs] = useState<Jobsexcel[]>([]); // Array of jobs

  const [selectedJob, setSelectedJob] = useState<Jobsexcel | null>(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:3001/jobs');
        const data = await response.json();

        // Handle potential errors in the fetched data
        if (!Array.isArray(data)) {
          console.error('Error: Expected jobs data to be an array');
          return; // Exit early if data is not an array
        }

        setJobs(data);
      } catch (error) {
        console.error('Error al obtener los trabajos:', error);
      }
    };

    fetchJobs();
  }, []);

  const handleJobSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedJobId = event.target.value;
  
    if (selectedJobId === "") { 
      setSelectedJob(null); 
      return; 
    }
  
    const selectedJob = jobs.find((job) => job.Name === selectedJobId); 
  
    setSelectedJob(selectedJob || null); 

  };

  return (
    <div>
      <div>
  {/* Mostrar el ID del trabajo seleccionado */}
  {selectedJob && <p>ID job: {selectedJob.id}</p>}
</div>
      <div>
        <Header />
      </div>
      <hr />
      <select onChange={handleJobSelect}>
        <option value="">Choose a job</option>
        {jobs.map((job) => (
          <option key={job.Name} value={job.Name}>
            {job.Name}
          </option>
        ))}
      </select>
      
      <hr />
      <Card selectedJob={selectedJob} />
    </div>
  );
}