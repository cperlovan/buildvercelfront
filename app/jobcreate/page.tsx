"use client"

import 'bootstrap/dist/css/bootstrap.min.css'
import './stylejobquery.css'
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../Components/Header';
import Swal from 'sweetalert2';



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
    deleteTableData()
    fetch('http://localhost:3001/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jobsData,
    })
      .then((response) => {
        if (response.ok) {
          Swal.fire({
            title: '¡Congratulation!',
            text: `${data.length} records have been sent to the database.`,
            icon: 'success'
          })
          setData([]);
          setError('');
        } else {
          console.error('Error sending jobs data:', response.statusText);
          // Handle errors from the backend (optional)
          setError('An error occurred while saving jobs. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error sending jobs data:', error);
        // Handle network errors (optional)
        setError('An error occurred while communicating with the server. Please check your internet connection and try again.');
      });
  }

  async function deleteTableData() {
    try {
      const response = await fetch('http://localhost:3001/jobs/delete', {
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
    <div>
      <Header />
      <div className="table-responsive">
      <div className='mb-3 ml-4' >
      <label htmlFor="formFile" className="form-label">Choose file</label> 
        <input
          className='form-control' 
          type="file" 
          id="formFile"
          onChange={handleFileChange} 
          style={{ display: 'block', fontSize: 'small' }} 
        />
        </div>
      {isLoading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}
      <form className="form-control" onSubmit={handleSubmit} >
        <button className="btn btn-secondary"  style={{fontSize: 'small', marginLeft:'5px'}} >Save jobs to database</button>
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
  );
}

export default JobTable;