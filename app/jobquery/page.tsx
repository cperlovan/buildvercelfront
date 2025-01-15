
"use client"
import React, { useState } from "react";
import { postBills } from "../actions";
import { useDispatch } from "react-redux";
import * as XLSX from 'xlsx';
//import Home from "./Home";



export default function BillCreate() {
    const dispatch = useDispatch();

    const [file, setFile] = useState(null);
    const [allBills, setallBills] = useState([]);
    
    
    function handleSubmit(e) {
        e.preventDefault();
        if(!allBills.job ) {
            dispatch(postBills(allBills))
            alert("Bills created successfully")
            setallBills([])
        } else {
            alert('The Bills was not registered, please try again');
            return
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleFileUpload = (e) => {
        e.preventDefault();
        if (file) {
            try {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    const data = e.target.result;

                    const excel = XLSX.read(data, { type: 'binary', cellText: false, cellDates: true});
                    const sheetName = excel.SheetNames[0];
                    const sheet = excel.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 0, raw: false, dateNF: 'mm-dd-yyyy' });
                    setallBills(jsonData);
                };
                fileReader.readAsBinaryString(file);
            } catch (error) {
                console.error("Error leyendo el archivo");
            }
        } else {
            alert('No has seleccionado un archivo');
        }
    };
     
    

    return (
        <div className='container mt-5'>
            <Home/>
            <form className='form mx-auto w-50' onSubmit={handleFileUpload}>
                <input type="file" onChange={handleFileChange} className='form-control' accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                <button className='btn btn-success mt-3'>Subir archivo de BILLS</button>
            </form>
            <form className="background-color:gray" onSubmit={handleSubmit} >
                <button className="btn btn-primary mt-3">Guardar BILL en base de datos</button>
                {(allBills.length > 0) && (
                    <div>
                        <table id="Datatable" className='table  table-hover table-striped mt-3'>
                            <thead>
                                <tr>
                                    {Object.keys(allBills[0]).map((key, index) => (
                                        <th key={index}>{key}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {allBills.map((fila, filaIndex) => (
                                    
                                    <tr key={filaIndex}>
                                        {Object.values(fila).map((value, colIndex) => (
                                            <td    key={colIndex}>{value} </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
                }
            </form>

        </div>

    )
}

