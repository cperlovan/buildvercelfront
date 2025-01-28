"use client"; 
import "../../app/globals.css";

import React, { useState, useEffect } from 'react';
import Card from './Card';
import Header from '../Components/Header';
//import Footer from "../Components/Footer";

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
        const response = await fetch('https://constructapi.vercel.app/jobs');
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
    <div className='w-full mx-auto px-4'>
      <Header />
      <hr />
      <select onChange={handleJobSelect} className='block mb-2 text-base font-medium text-gray-900 dark:text-white'>
        <option value="">Choose a job</option>
        {jobs.map((job) => (
          <option key={job.Name} value={job.Name}>
            {job.Name}
          </option>
        ))}
      </select>
      
      <hr />
      <Card selectedJob={selectedJob} />
      {/* <Footer /> */}
    </div>
  );
}