"use client"

import "../../app/globals.css";
import './stylejobquery.css'
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../Components/Header';
import Swal from 'sweetalert2';
import Footer from "../Components/Footer";



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

function JobTable() {
  const [data, setData] = useState<Jobsexcel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return; // Handle case where no file is selected

    setIsLoading(true);
    setError(""); // Clear any previous errors

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;

      try {
        const workbook = XLSX.read(data, { type: 'binary', cellText: false, cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as Jobsexcel[];

        setData(jsonData);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setError('Error reading Excel file. Please check the file format.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Handle potential errors during data fetching (optional)
  useEffect(() => {
    if (error) {
      // Display an error message to the user
      console.error('Error:', error);
      // You can also display an error message in the UI using a state variable
    }
  }, [error]);


  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Check if there's data to send
    if (!data || data.length === 0) {
      console.error('No data to submit. Please upload an Excel file.');
      return;
    }

    // Prepare the data to send (assuming your backend expects JSON)
    const jobsData = JSON.stringify(data);

    // Send the data to your backend using fetch or any other HTTP library
    setIsLoading(true);
    deleteTableData()
    fetch('https://constructapi.vercel.app/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jobsData,
    })
      .then((response) => {
        if (response.ok) {
          setIsLoading(false);
          Swal.fire({
            title: '¡Congratulation!',
            text: `${data.length} records have been sent to the database.`,
            icon: 'success'
          })
          setData([]);
          setError('');
        } else {
          setIsLoading(false);
          console.error('Error sending jobs data:', response.statusText);
          // Handle errors from the backend (optional)
          setError('An error occurred while saving jobs. Please try again.');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error sending jobs data:', error);
        // Handle network errors (optional)
        setError('An error occurred while communicating with the server. Please check your internet connection and try again.');
      });
  }

  async function deleteTableData() {
    try {
      const response = await fetch('https://constructapi.vercel.app/jobs/delete', {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error('Error deleting table');
      }

      console.log('Table deleted successfully');
    } catch (error) {
      console.error('Error deleting table:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    }
  }

  return (
    <div w-full mx-auto px-4>
      <Header />
      <div>
        <div className="table-responsive rounded-sm bg-gray-2">
          <div className='mb-3 ' >
            <label className="mb-3 block text-sm font-bold text-black dark:text-white ml-2"> Attach file</label>
            <input
              className='w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary'
              type="file"
              id="formFile"
              onChange={handleFileChange}
              style={{ display: 'block', fontSize: 'small' }}
            />
          </div>
          {isLoading && <p className="text-red-500">Loading data...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <form className="bg-gray-100 p-4 rounded-md shadow-sm mt-3" onSubmit={handleSubmit} >
            <button className="flex w-full items-center text-white justify-start gap-3.5 rounded-lg border border-stroke bg-gray-800 p-4 hover:bg-gray-900 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50 "
              disabled={isLoading}
              style={{ fontSize: 'small', marginLeft: '5px' }} >Save jobs to database</button>
            {!isLoading && data.length > 0 && (
              <table id="Datatable" className="table table-hover fs-6 table-striped mt-3">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>StreetAddress</th>
                    <th>State</th>
                    <th>ContractPrice</th>
                    <th>CostsOutstanding</th>
                    <th>CostsPaid</th>
                    <th>AmountInvoiced</th>
                    <th>JobRunningTotal</th>
                    <th>PaymentsReceived</th>
                    <th>ProjStart</th>
                    <th>ActualCompletion</th>
                    <th>ActualStart</th>
                    <th>ProjCompletion</th>
                    <th>TotalCosts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Name}</td>
                      <td>{row.StreetAddress}</td>
                      <td>{row.State}</td>
                      <td>{row.ContractPrice}</td>
                      <td>{row.CostsOutstanding}</td>
                      <td>{row.CostsPaid}</td>
                      <td>{row.AmountInvoiced}</td>
                      <td>{row.JobRunningTotal}</td>
                      <td>{row.PaymentsReceived}</td>
                      <td>{row.ProjStart ? new Date(row.ProjStart).toLocaleDateString('en-US',) : ''}</td>
                      <td>{row.ActualCompletion ? new Date(row.ActualCompletion).toLocaleDateString('en-US') : ''}</td>
                      <td>{row.ActualStart ? new Date(row.ActualStart).toLocaleDateString('en-US') : ''}</td>
                      <td>{row.ProjCompletion ? new Date(row.ProjCompletion).toLocaleDateString('en-US') : ''}</td>
                      <td>{row.TotalCosts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </form>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default JobTable;