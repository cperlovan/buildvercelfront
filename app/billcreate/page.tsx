"use client"
import "../../app/globals.css";

import './stylebills.css'
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../Components/Header';
import Swal from 'sweetalert2';
import moment from 'moment';




interface Jobsexcel {
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
  RelatedPOs:	string;
  LienWaivers: string;

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

   // Function to format date in mm/dd/yyyy
  //  const formatDate = (date: Date) => {
  //   if (!date) return ''; 
  
  //   const month = String(date.getMonth() + 1).padStart(2, '0'); 
  //   const day = String(date.getDate()).padStart(2, '0'); 
  //   const year = date.getFullYear(); 
  
  //   return `${month}/${day}/${year}`; 
  // };

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
    // Format InvoiceDate before sending data
    // Format all date fields before sending data
    // const formattedData = data.map((row) => ({
    //   ...row,
    //   InvoiceDate: row.InvoiceDate ? new Date(row.InvoiceDate) : null, 
    //   CreatedDate: row.CreatedDate ? new Date(row.CreatedDate) : null,
    //   DatePaid: row.DatePaid ? new Date(row.DatePaid) : null,
    //   DueDate: row.DueDate ? new Date(row.DueDate) : null,
    // }));
    // const formattedData = data.map((row) => ({
    //   ...row,
    //   InvoiceDate: moment(row.InvoiceDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    //   DueDate: moment(row.DueDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    //   DatePaid: moment(row.DatePaid, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    //   CreatedDate: moment(row.CreatedDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    // }));
    // const formattedData = data.map((row) => {
    //   let formattedInvoiceDate;
    //   try {
    //     formattedInvoiceDate = moment(row.InvoiceDate, 'MM/DD/YYYY').format('YYYY-MM-DD');
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   } catch (error) {
    //     console.error(`Error formatting InvoiceDate for row: ${JSON.stringify(row)}`);
    //     // Handle the invalid date (e.g., skip the record, display an error message)
    //   }
    //   return {
    //     ...row,
    //     InvoiceDate: formattedInvoiceDate,
    //     DueDate: moment(row.DueDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    //     DatePaid: moment(row.DatePaid, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    //     CreatedDate: moment(row.CreatedDate, 'MM/DD/YYYY').format('YYYY-MM-DD'),
    //   };
    // });
    const formattedData = data.map((row) => ({
      ...row,
      InvoiceDate: moment(row.InvoiceDate, 'MM/DD/YYYY', true).isValid() ?
        moment(row.InvoiceDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
        DueDate: moment(row.DueDate, 'MM/DD/YYYY', true).isValid() ?
        moment(row.DueDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
        DatePaid: moment(row.DatePaid, 'MM/DD/YYYY', true).isValid() ?
        moment(row.DatePaid, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
        CreatedDate: moment(row.CreatedDate, 'MM/DD/YYYY', true).isValid() ?
        moment(row.CreatedDate, 'MM/DD/YYYY').format('YYYY-MM-DD') : null,
    }));


    
    console.log(formattedData)
   
  
    // Prepare the data to send (assuming your backend expects JSON)
    const jobsData = JSON.stringify(formattedData);

    
     
    // Send the data to your backend using fetch or any other HTTP library
    deleteTableData()
    fetch('https://constructapi.vercel.app/bills', {
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
      const response = await fetch('https://constructapi.vercel.app/bills/delete', {
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
      <div className='w-full mx-auto px-4'>
      <Header />
      </div>
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
        <button className="btn btn-secondary"  style={{fontSize: 'small', marginLeft:'5px'}} >Save bills to database</button>
      {!isLoading && data.length > 0 && (
        <table id="Datatable" className="table table-hover fs-6 table-striped mt-3">
          <thead>
            <tr>
              <th>Job</th>
              <th>Bill</th>
              <th>Bill Title</th>
              <th>Pay to</th>
              <th>Bill amount</th>
              <th>Invoce date</th>
              <th>Due date</th>
              <th>Bill status</th>
              <th>Date Paid</th>
              <th>Paid by</th>
              <th>Created date</th>
              <th>Files</th>
              <th>Comments</th>
              <th>Variance codes</th>
              <th>Cost codes</th>
              <th>Related POs</th>
              <th>Lien Waivers</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.Job}</td>
              <td>{row.Bill}</td>
              <td>{row.BillTitle}</td>
              <td>{row.PayTo}</td>
              <td>{row.BillAmount}</td>
              <td>{row.InvoiceDate ? new Date(row.InvoiceDate).toLocaleDateString('en-US',) : ''}</td>
              <td>{row.DueDate ? new Date(row.DueDate).toLocaleDateString('en-US',) : ''}</td>
              <td>{row.BillStatus}</td>
              <td>{row.DatePaid ? new Date(row.DatePaid).toLocaleDateString('en-US',) : ''}</td>
              <td>{row.PaidBy}</td>
              <td>{row.CreatedDate ? new Date(row.CreatedDate).toLocaleDateString('en-US',) : ''}</td>
              <td>{row.Files}</td>
              <td>{row.Comments}</td>
              <td>{row.VarianceCodes}</td>
              <td>{row.CostCodes}</td>
              <td>{row.RelatedPOs}</td>
              <td>{row.LienWaivers}</td>
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

export default Page;