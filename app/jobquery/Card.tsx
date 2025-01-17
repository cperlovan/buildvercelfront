import React, { useEffect, useState } from 'react'

import './stylejobquery.css'
import ProgressBar from "./ProgressBar"
import { v4 as uuidv4 } from 'uuid'; 



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

interface Billsexcel {
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

  interface PayToResult {
    [key: string]: { 
      [key: string]: number; 
    };
  }

export default function Card({ selectedJob }: { selectedJob: Jobsexcel | null }) {

    const [bi, setBi] = useState([])
    const [po, setPo] = useState([])
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('http://localhost:3001/bills');
                const databills = await response.json();
                console.log(databills)
                setBi(databills);
            } catch (error) {
                console.error('Error al obtener los bills:', error);
            }
            try {
                const response = await fetch('http://localhost:3001/po');
                const datapo = await response.json();
                setPo(datapo);
            } catch (error) {
                console.error('Error al obtener los bills:', error);
            }
        };

        fetchJobs();
    }, [selectedJob]);


    const formatNumber = (number: number | bigint)=>{
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
    }

    const bil: Billsexcel[] = bi
    const billxpaytoxjobPaid = bil?.reduce<PayToResult>((result, bill:Billsexcel) => {
        // Iteramos sobre los trabajos a analizar
        if (bill.Job === selectedJob?.Name && bill.BillStatus === "Paid") {
          const { PayTo, Job, BillAmount } = bill;
          result[PayTo] = result[PayTo] || {};
          result[PayTo][Job] = (result[PayTo][Job] || 0) + BillAmount;
      
          // Acumulamos el total por proyecto
          // result.totalPorProyecto = result.totalPorProyecto || {};
          // result.totalPorProyecto[job] = (result.totalPorProyecto[job] || 0) + billamount;
        }
        return result;
      }, {});

     


    return (

        <>

        <div className="card">
            <div className="cardunidad" >
                <div className="cardtexto">
                    {selectedJob && (
                        <div className='job'>
                            <div className="name" key={selectedJob.Name}>Jobs:  {selectedJob.Name}</div>
                              <div className='infojob'>
                                    <div className="div1" key={selectedJob.Name + selectedJob.StreetAddress}><strong>address: </strong>{selectedJob.StreetAddress}</div>
                                    <div className="div2" key={selectedJob.Name +  selectedJob.State}> <strong>State: </strong> {selectedJob.State}</div>
                                    <div className="div6" key={selectedJob.Name + + selectedJob.ActualCompletion}> <strong>Actual Completion: </strong> {selectedJob.ActualCompletion && new Date(selectedJob.ActualCompletion).toLocaleDateString()} </div>
                                    <div className="div5" key={selectedJob.Name +  selectedJob.ActualStart}> <strong>ActualStart: </strong> {selectedJob.ActualStart && new Date(selectedJob.ActualStart).toLocaleDateString()} </div>


                                    <p className="div3" key={selectedJob.Name + selectedJob.ProjStart}> <strong>Proj start: </strong> {selectedJob.ProjStart && new Date(selectedJob.ProjStart).toLocaleDateString()} </p>
                                    <p className="div4" key={selectedJob.Name + selectedJob.ProjCompletion}> <strong>Proj Completion: </strong> {selectedJob.ProjCompletion && new Date(selectedJob.ProjCompletion).toLocaleDateString()}</p>
                                    <p className="div7" key={selectedJob.Name + selectedJob.ContractPrice}><strong>Contract Price: </strong><span>{formatNumber(selectedJob.ContractPrice)}</span></p>


                                    <p className="div8" key={selectedJob.Name + selectedJob.JobRunningTotal}> <strong>Job Running Total: </strong> <span>{formatNumber(selectedJob.JobRunningTotal)} </span></p>


                                    <p className="div9" key={selectedJob.Name + selectedJob.CostsOutstanding}> <strong>Costs Outstanding: </strong> <span>{formatNumber(selectedJob.CostsOutstanding)} </span> </p>


                                    <p className="div10" key={selectedJob.Name + selectedJob.CostsPaid}> <strong>Costs Paid: </strong> <span>{formatNumber(selectedJob.CostsPaid)}</span> </p>
                                    <p className="div11" key={selectedJob.Name + selectedJob.TotalCosts}> <strong>Total cost: </strong> <span>{formatNumber(selectedJob.TotalCosts)}</span> </p>
                                </div>
                                <div className="App">
                                    <ProgressBar totalCost={selectedJob.TotalCosts} jobRunningTotal={selectedJob.JobRunningTotal} />
                                </div>

                            </div>
                            
                        )}
                        <div className="detailjob">
                            
                            <div className='bill'>
                            <div className="title">Bills:</div>
                                <table className='table table-hover table-striped mt-3 text-black-50'>
                                    <thead>
                                        <tr>
                                            <th>Vendor</th>
                                            <th>Amount</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {billxpaytoxjobPaid && 
                                            Object.keys(billxpaytoxjobPaid).map(vendor => (
                                                <tr key={uuidv4()}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(billxpaytoxjobPaid[vendor][Object.keys(billxpaytoxjobPaid[vendor])[0]])} </td>
                                                    <td>Paid</td>
                                                </tr>
                                            ))}
                                        <tr>
                                            <td className='bold'>Total</td>
                                            <td className='bold'>{billxpaytoxjobPaid &&
                                               formatNumber( Object.values(billxpaytoxjobPaid)
                                                    .map(obj => Object.values(obj)[0])
                                                    .reduce((total, amount) => total + amount, 0)
                                           ) }</td>
                                           <td className='bold'>Paid</td>
                                        </tr> 
                                    </tbody>
                                </table>
                                {/* Ready for paid */}
                                <hr />
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}
