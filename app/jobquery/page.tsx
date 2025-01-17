"use client"

import React, { useState, useEffect } from 'react';
import Card from './Card';
import Header from '../Components/Header'; 


interface Jobsexcel {
    ContractPrice: number;
    CostsOutstanding: number;
    CostsPaid: number;
    JobRunningTotal: number;
    Name: string;
    AmountInvoiced: number;
    PaymentsReceived: number;
    ProjStart: Date; // Assuming ProjStart is a date
    ActualCompletion: Date;
    ActualStart: Date;
    ProjCompletion: Date;
    State: string;
    StreetAddress: string;
    TotalCosts: number;
  }


export default function Page() {
    const [jobs, setJobs] = useState([]);

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const response = await fetch('http://localhost:3001/jobs');
          const data = await response.json();
          setJobs(data);
        } catch (error) {
          console.error('Error al obtener los trabajos:', error);
        }
        
      };
  
      fetchJobs();
    }, []);

  

    const handleJobSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedJobId = event.target.value;
        const selectedJob = jobs.find((job) => job.id === parseInt(selectedJobId)); 
        setSelectedJob(selectedJob);
    };
    
    
    return (
      <div>
        <div>
            <Header />
        </div>
        <hr />
        <select onChange={handleJobSelect}>
        <option value="">Selecciona un trabajo</option>
        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.Name}
          </option>
        ))}
      </select>
      <hr />
      <Card selectedJob={selectedJob} /> 
    </div>
  );

  }
  

