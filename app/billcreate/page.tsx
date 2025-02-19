"use client"
import "../../app/globals.css";
import './stylebills.css'
import React, { useState, useEffect, useCallback } from 'react';
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
  DueDate: string | null | undefined;
  BillStatus: string | undefined;
  DatePaid: string | null | undefined;
  PaidBy: string | undefined;
  CreatedDate: string | null | undefined;
  Files: string | undefined;
  Comments: string | undefined;
  VarianceCodes: string | undefined;
  CostCodes: string[] | string | undefined;
  RelatedPOs: string | undefined;
  LienWaivers: undefined | string;
  [key: string]: string | number | string[] | null | undefined; // Firma de índice
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

  const excelDateToJSDate = useCallback((excelDate: number): Date => {
      const unixTimestamp = (excelDate - 25569) * 86400 * 1000;
      return new Date(unixTimestamp);
  }, []);

  const processRow = useCallback((row: ExcelRow): Jobsexcel => {
      let CostCodes: string | number | string[] | undefined = row.CostCodes;

      if (typeof CostCodes === 'string') {
          CostCodes = CostCodes.split('|').map((item) => item.trim());
      } else if (typeof CostCodes === 'number') {
          CostCodes = [CostCodes];
      } else if (!Array.isArray(CostCodes)) {
          CostCodes = [];
      }

      const formattedRow: Jobsexcel = { ...row, CostCodes: CostCodes };

      const dateFields: (keyof Jobsexcel)[] = ["InvoiceDate", "DueDate", "DatePaid", "CreatedDate"];
      dateFields.forEach((field) => {
          const value = formattedRow[field];

          if (typeof value === "number") { // Fechas numéricas (Excel)
              const jsDate = excelDateToJSDate(value);
              formattedRow[field] = moment(jsDate).format("YYYY-MM-DD");
          } else if (typeof value === "string") {
              if (value === "-" || value === "") { // Valores "-" o vacíos
                  formattedRow[field] = null;
              } else {
                  const momentDate = moment(value, ["YYYY-MM-DD", "MM/DD/YYYY"], true); // Prueba ambos formatos
                  if (momentDate.isValid()) {
                      formattedRow[field] = momentDate.format("YYYY-MM-DD");
                  } else {
                      console.error(`Fecha inválida para ${field}: ${value}`);
                      formattedRow[field] = null;
                  }
              }
          } else {
              formattedRow[field] = null; // Otros valores (undefined, null)
          }
      });

      return formattedRow;
  }, []); // Eliminado excelDateToJSDate de las dependencias

  useEffect(() => {
      if (data && data.length > 0) {
          const processedData: Jobsexcel[] = data.map((row) => processRow(row as ExcelRow));
          setFormattedData(processedData);
      }
  }, [data, processRow]);

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
    
        console.log("Datos extraídos del Excel (jsonData):", jsonData);
        console.log("Encabezados del Excel (headers):", headers);

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


  const sendDataInBatches = async (data: Jobsexcel[], batchSize: number) => {
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      //console.log(`Enviando batch ${i / batchSize + 1} con ${batch.length} registros.`);

      // 🔹 Verifica los datos antes de enviarlos
      //console.log("Contenido del batch:", JSON.stringify(batch, null, 2));

      try {
         const response = await fetch('https://constructapi.vercel.app/bills', {
         // const response = await fetch('http://localhost:3030/bills', {
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

  

    await deleteTableData();

    // Enviar los datos en lotes
    const batchSize = 200;
    const success = await sendDataInBatches(formattedData, batchSize);

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
        //  const response = await fetch('http://localhost:3030/bills/delete', {
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
    <div className='w-full mx-auto px-4'>
      <Header />
      <div className="table-responsive rounded-sm bg-gray-2">
        <div className='mb-3'>
          <label className="mb-3 block text-sm font-bold text-black dark:text-white ml-2">Choose file</label>
          <input className='w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary'
            type="file"
            id="formFile"
            onChange={handleFileChange} 
            style={{ display: 'block', fontSize: 'small' }}/>
            
        </div>
        {isLoading && <p>Loading data...</p>}
        {error && <p className="error">{error}</p>}
        <form className='bg-gray-100 p-4 rounded-md shadow-sm mt-3' onSubmit={handleSubmit}>
          <button className="flex w-full items-center text-white justify-start gap-3.5 rounded-lg border border-stroke bg-gray-800 p-4 hover:bg-gray-900 dark:border-strokedark dark:bg-meta-4 dark:hover:bg-opacity-50 "
            disabled={isLoading}
            style={{ fontSize: 'small', marginLeft: '5px' }} >
            Save BILLS to database
          </button>

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