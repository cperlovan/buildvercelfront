"use client"
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';


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
        console.log(jsonData);
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

  

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {isLoading && <p>Loading data...</p>}
      {error && <p className="error">{error}</p>}
      {!isLoading && data.length > 0 && (
        <table id="Datatable" className="table table-hover table-striped mt-3">
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
    </div>
  );
}

export default JobTable;