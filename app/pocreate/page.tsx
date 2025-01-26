"use client"
import "../../app/globals.css";

import './stylebills.css'
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../Components/Header';
import Swal from 'sweetalert2';





interface Jobsexcel {
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

function Page() {
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
        const workbook = XLSX.read(data, { type: 'binary' });
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


    setIsLoading(true);

    // Send the data to your backend using fetch or any other HTTP library
    deleteTableData()
    fetch('https://constructapi.vercel.app/po', {
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
          console.error('Error sending PO data:', response.statusText);
          // Handle errors from the backend (optional)
          setError('An error occurred while saving jobs. Please try again.');
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error sending PO data:', error);
        // Handle network errors (optional)
        setError('An error occurred while communicating with the server. Please check your internet connection and try again.');
      });

  }

  async function deleteTableData() {
    try {
      const response = await fetch('https://constructapi.vercel.app/po/delete', {
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
    <div className='w-full mx-auto px-4'>
      <Header />
      <div>
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
            <button className="btn btn-secondary" disabled={isLoading} style={{ fontSize: 'small', marginLeft: '5px' }} >Save PO to database</button>
            {!isLoading && data.length > 0 && (
              <table id="Datatable" className="table table-hover fs-6 table-striped mt-3">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>PO</th>
                    <th>Title</th>
                    <th>Variance Code</th>
                    <th>Cost Code</th>
                    <th>Performed By</th>
                    <th>Est Complete</th>
                    <th>P.O. Status</th>
                    <th>Comments</th>
                    <th>Paid</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, index) => (
                    <tr key={index}>
                      <td>{row.Job}</td>
                      <td>{row.PO}</td>
                      <td>{row.Title}</td>
                      <td>{row.VarianceCode}</td>
                      <td>{row.CostCode}</td>
                      <td>{row.PerformedBy}</td>
                      <td>{row.EstComplete}</td>
                      <td>{row.POStatus}</td>
                      <td>{row.Comments}</td>
                      <td>{row.Paid}</td>
                      <td>{row.Cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;