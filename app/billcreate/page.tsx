"use client"
import "../../app/globals.css";

import './stylebills.css'
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Header from '../Components/Header';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from "../Components/Footer";




// Definición de la interfaz para los datos del Excel
interface Jobsexcel {
  Job: string | undefined;
  Bill: string | undefined;
  BillTitle: string | undefined;
  PayTo: string | undefined;
  BillAmount: string | number | null | undefined;
  InvoiceDate: string | null | undefined;
  DueDate: string | null |  undefined;
  BillStatus: string | undefined;
  DatePaid: string | null | undefined;
  PaidBy: string | undefined;
  CreatedDate: string | null |undefined;
  Files: string | undefined;
  Comments: string | undefined;
  VarianceCodes: string | undefined;
  CostCodes: string[] | string | undefined;
  RelatedPOs: string | undefined;
  LienWaivers: undefined | string; // Se maneja como array o undefined
}

interface ExcelRow {
  Job: string | undefined;
  Bill: string | undefined;
  BillTitle: string | undefined;
  PayTo: string | undefined;
  BillAmount: string | undefined; // Se manejará la conversión a número
  InvoiceDate: string | undefined;
  DueDate: string | undefined;
  BillStatus: string | undefined;
  DatePaid: string | undefined;
  PaidBy: string | undefined;
  CreatedDate: string | undefined;
  Files: string | undefined;
  Comments: string | undefined;
  VarianceCodes: string | undefined;
  CostCodes: string | undefined;
  RelatedPOs: string | undefined;
  LienWaivers: string | undefined; // Se manejará la conversión a array
}

function Page() {
  const [data, setData] = useState<Jobsexcel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formattedData, setFormattedData] = useState<Jobsexcel[]>([]);
  const [fileDataLoaded, setFileDataLoaded] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      const processedData: Jobsexcel[] = data.map((row) => processRow(row as ExcelRow));
      setFormattedData(processedData);
    }
  }, [data]);

  function processRow(row: ExcelRow): Jobsexcel {
    let CostCodes: string | number | string[] | undefined = row.CostCodes;

    if (typeof CostCodes === 'string') {
      CostCodes = CostCodes.split('|').map((item) => item.trim());
    } else if (typeof CostCodes === 'number') {
      CostCodes = [CostCodes];
    } else if (!Array.isArray(CostCodes)) {
      CostCodes = [];
    }

    const formattedRow: Jobsexcel = { ...row, CostCodes: CostCodes };

    // Convertir fechas de número a MM/DD/YYYY si es necesario
    const dateFields: (keyof Jobsexcel)[] = ["InvoiceDate", "DueDate", "DatePaid", "CreatedDate"];
    dateFields.forEach((field) => {
      const value = formattedRow[field];

      if (typeof value === "number") {
        formattedRow[field] = moment("1900-01-01").add(value - 2, "days").format("MM/DD/YYYY");
      } else if (typeof value === "string" && !isNaN(Number(value))) {
        formattedRow[field] = moment("1900-01-01").add(Number(value) - 2, "days").format("MM/DD/YYYY");
      }
    });

    return formattedRow;
  }


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      try {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData: (string | undefined)[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const headers: string[] = jsonData[0] as string[];

        const dataRows: Jobsexcel[] = jsonData.slice(1).map((row: (string | undefined)[]) => {
          const excelRow: ExcelRow = {} as ExcelRow;
          headers.forEach((header, index) => {
            excelRow[header as keyof ExcelRow] = row[index];
          });
          return processRow(excelRow);
        });
        
        setData(dataRows);
        setFileDataLoaded(true);
      } catch (error) {
        console.error('Error reading Excel file:', error);
        setError('Error reading Excel file. Please check the file format.');
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsBinaryString(file);
  };


  const sendDataInBatches = async (data: string | any[], batchSize: number) => {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      console.log(`Enviando batch ${i / batchSize + 1} con ${batch.length} registros.`);

      // 🔹 Verifica los datos antes de enviarlos
      console.log("Contenido del batch:", JSON.stringify(batch, null, 2));

      try {
        const response = await fetch('https://constructapi.vercel.app/bills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(batch),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error en batch ${i / batchSize + 1}: ${errorText}`);
        }
      } catch (error) {
        console.error('Error al enviar batch:', error);
        return false; // Si falla un batch, detiene el proceso
      }
    }
    return true;
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!data || data.length === 0) {
      console.error('No data to submit. Please upload an Excel file.');
      return;
    }

    setIsLoading(true);

    // Procesar datos y formatear fechas
    const processedData = data.map((row) => {
      let CostCodes = row.CostCodes;

      if (typeof CostCodes === 'string') {
        CostCodes = CostCodes.split('|').map((item: string) => item.trim());
      } else if (typeof CostCodes === 'number') {
        CostCodes = [CostCodes];
      } else if (!Array.isArray(CostCodes)) {
        CostCodes = [];
      }

      const formattedRow = { ...row };

      if (formattedRow.InvoiceDate && moment(formattedRow.InvoiceDate, "YYYY-MM-DD", true).isValid()) {
        formattedRow.InvoiceDate = moment(formattedRow.InvoiceDate).format('YYYY-MM-DD');
      } else {
        formattedRow.InvoiceDate = null; // O enviar un valor por defecto si la fecha no es válida
      }
      if (formattedRow.DueDate && moment(formattedRow.DueDate, "YYYY-MM-DD", true).isValid()) {
        formattedRow.DueDate = moment(formattedRow.DueDate).format('YYYY-MM-DD');
      } else {
        formattedRow.DueDate = null; // O enviar un valor por defecto si la fecha no es válida
      }
      if (formattedRow.DatePaid && moment(formattedRow.DatePaid, "YYYY-MM-DD", true).isValid()) {
        formattedRow.DatePaid = moment(formattedRow.DatePaid).format('YYYY-MM-DD');
      } else {
        formattedRow.DatePaid = null; // O enviar un valor por defecto si la fecha no es válida
      }
      if (formattedRow.CreatedDate && moment(formattedRow.CreatedDate, "YYYY-MM-DD", true).isValid()) {
        formattedRow.CreatedDate = moment(formattedRow.CreatedDate).format('YYYY-MM-DD');
      } else {
        formattedRow.CreatedDate = null; // O enviar un valor por defecto si la fecha no es válida
      }

      return formattedRow;
    });

    // console.log("Datos formateados antes de enviar:", JSON.stringify(processedData, null, 2));

    setFormattedData(processedData);

    await deleteTableData();

    // Enviar los datos en lotes
    const batchSize = 200;
    const success = await sendDataInBatches(processedData, batchSize);

    setIsLoading(false);

    if (success) {
      Swal.fire({
        title: '¡Congratulation!',
        text: `${data.length} records have been sent to the database.`,
        icon: 'success',
      });
      setData([]);
    } else {
      console.error('Error sending data in batches');
      setError('An error occurred while saving jobs. Please try again.');
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
      }
    }

  }

  return (
    <div>
      <Header />
      <div className="table-responsive">
        <div className='mb-3 ml-4'>
          <label htmlFor="formFile" className="form-label">Choose file</label>
          <input className='form-control' type="file" id="formFile" onChange={handleFileChange} />
        </div>
        {isLoading && <p>Loading data...</p>}
        {error && <p className="error">{error}</p>}
        <form className='form-control' onSubmit={handleSubmit}>
          <button className="btn btn-secondary" disabled={isLoading} style={{ fontSize: 'small', marginLeft: '5px' }} >Save BILLS to database</button>

          {data.length > 0 && fileDataLoaded && (
            <table id="Datatable" className="table table-hover fs-6 table-striped mt-3">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Bill</th>
                  <th>Bill Title</th>
                  <th>Materials Used</th>
                  <th>Store</th>
                  <th>Pay to</th>
                  <th>Bill amount</th>
                  <th>Invoice date</th>
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
                {formattedData.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => <td key={i}>{Array.isArray(value) ? value.join(', ') : value ?? ""}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Page;