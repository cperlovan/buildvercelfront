"use client";

import React, { useEffect, useState } from 'react'
import "../../app/globals.css";

import './stylejobquery.css'
import ProgressBar from "./ProgressBar"
import Modalpo from './Modalpo'
import Modalbill from './Modalbill';





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
    RelatedPOs: string;
    LienWaivers: string;

}

interface posexcel {
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

interface PoData {
    id: number;
    title: string;
    // Add other properties as needed based on your API response
    performedBy: string;
    job: string;
    // ...
}

interface PayToResult {
    [key: string]: {
        [key: string]: number;
    };
}

interface PayToResult2 {
    [key: string]: {
        Jobs: string[];
        TotalCost: number;
        PaidAmount: number;
        ReadyForPaymentAmount: number;
    };
}

interface PoData {
    id: number;
    Title: string;
    PerformedBy: string
    Cost: number;
    Paid: string;
}

interface billData {
    id: number;
    BillTitle: string;
    PayTo: string
    BillAmount: number;
    BillStatus: string;
}



export default function Card({ selectedJob }: { selectedJob: Jobsexcel | null }) {

    const [bi, setBi] = useState([])
    const [po, setPo] = useState([])
    const [poData, setPoData] = useState<PoData[]>([]);
    const [billData, setbillData] = useState<billData[]>([]);  // Estado para almacenar los datos de las PO
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenb, setIsModalOpenb] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await fetch('https://constructapi.vercel.app/bills');
                const databills = await response.json();
                setBi(databills);
            } catch (error) {
                console.error('Error al obtener los bills:', error);
            }
            try {
                const response = await fetch('https://constructapi.vercel.app/po');
                const datapo = await response.json();
                setPo(datapo);
            } catch (error) {
                console.error('Error al obtener los bills:', error);
            }
        };

        fetchJobs();
    }, [selectedJob]);


    const formatNumber = (number: number | bigint) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
    }

    const bil: Billsexcel[] = bi
    function calculateTotalsByStatus(bills: Billsexcel[], selectedJob: Jobsexcel | null, status: string): PayToResult {
        return bills.reduce<PayToResult>((result, bill) => {
            if (bill.Job === selectedJob?.Name && bill.BillStatus === status) {
                const { PayTo, Job, BillAmount } = bill;
                result[PayTo] = result[PayTo] || {};
                result[PayTo][Job] = (result[PayTo][Job] || 0) + BillAmount;
            }
            return result;
        }, {});
    }

    const billxpaytoxjobPaid = calculateTotalsByStatus(bil, selectedJob, 'Paid');
    const billxpaytoxjobReady = calculateTotalsByStatus(bil, selectedJob, 'Ready For Payment');

    const calculatePOData = (pos: posexcel[], selectedJob: Jobsexcel | null, paidStatus: string): PayToResult2 => {
        return pos?.reduce<PayToResult2>((result, p) => {
            if (p.Job === selectedJob?.Name && p.Paid === paidStatus) {
                const { PerformedBy, Job, Cost } = p;
                result[PerformedBy] = result[PerformedBy] || { Jobs: [], TotalCost: 0 };
                result[PerformedBy].Jobs.push(Job);
                result[PerformedBy].TotalCost += Cost;
            }
            return result;
        }, {} as PayToResult2);
    };
 

    const handleVendorClick = async (vendorData: { PerformedBy: string; Job: string; }) => {
        try {
            const response = await fetch(`https://constructapi.vercel.app/po?PerformedBy=${encodeURIComponent(vendorData.PerformedBy)}&Job=${encodeURIComponent(vendorData.Job)}`);
            const newPoData = await response.json();
            setPoData(newPoData);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handlePayToClick = async (vendorData: { PayTo: string; Job: string; }) => {
        try {
            const response = await fetch(`https://constructapi.vercel.app/bills?PayTo=${encodeURIComponent(vendorData.PayTo)}&Job=${encodeURIComponent(vendorData.Job)}`);
            const newbillData = await response.json();
            setbillData(newbillData);
            setIsModalOpenb(true);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const poxPerformedbyxJobNotPaid = calculatePOData(po, selectedJob, "Not Paid");
    const poxPerformedbyxJobNotPartially = calculatePOData(po, selectedJob, "Partially Paid");
    const poxPerformedbyxJobNotFully = calculatePOData(po, selectedJob, "Fully Paid");
    
  
    
    return (

        <>

            <div className="card">
                <div className="cardunidad" >
                    <div className="cardtexto">
                        {selectedJob && (
                            <div className='job'>
                                <div className="name" key={"Name"}>Jobs:  {selectedJob.Name}</div>
                                <div className='infojob'>
                                    <div className="div1" key={"StreetAddress"}><strong>address: </strong>{selectedJob.StreetAddress}</div>
                                    <div className="div2" key={"State"}> <strong>State: </strong> {selectedJob.State}</div>
                                    <div className="div6" key={selectedJob.Name + selectedJob.ActualCompletion}> <strong>Actual Completion: </strong> {selectedJob.ActualCompletion && new Date(selectedJob.ActualCompletion).toLocaleDateString()} </div>
                                    <div className="div5" key={"ActualStart"}> <strong>ActualStart: </strong> {selectedJob.ActualStart && new Date(selectedJob.ActualStart).toLocaleDateString()} </div>


                                    <p className="div3" key={"ProjStart"}> <strong>Proj start: </strong> {selectedJob.ProjStart && new Date(selectedJob.ProjStart).toLocaleDateString()} </p>
                                    <p className="div4" key={"ProjCompletion"}> <strong>Proj Completion: </strong> {selectedJob.ProjCompletion && new Date(selectedJob.ProjCompletion).toLocaleDateString()}</p>
                                    <p className="div7" key={"ContractPrice"}><strong>Contract Price: </strong><span>{formatNumber(selectedJob.ContractPrice)}</span></p>


                                    <p className="div8" key={"JobRunningTotal"}> <strong>Job Running Total: </strong> <span>{formatNumber(selectedJob.JobRunningTotal)} </span></p>


                                    <p className="div9" key={"CostsOutstanding"}> <strong>Costs Outstanding: </strong> <span>{formatNumber(selectedJob.CostsOutstanding)} </span> </p>


                                    <p className="div10" key={"CostsPaid"}> <strong>Costs Paid: </strong> <span>{formatNumber(selectedJob.CostsPaid)}</span> </p>
                                    <p className="div11" key={"TotalCosts"}> <strong>Total cost: </strong> <span>{formatNumber(selectedJob.TotalCosts)}</span> </p>
                                </div>

                            
                                <div className="App">
                                    <ProgressBar totalCost={selectedJob.TotalCosts} jobRunningTotal={selectedJob.JobRunningTotal} />
                                </div>

                            </div>

                        )}
                        <div className="detailjob">

                            <div className='bill'>
                                <div className="title">Bills:</div>

                                {Object.keys(billxpaytoxjobPaid).length > 0 && (
                                    <table className='table table-hover table-striped mt-3 text-black-50'>
                                        <thead>
                                            <tr>
                                                <th>Vendor</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(billxpaytoxjobPaid).map(([vendor, amounts]) => (
                                                <tr key={vendor} onClick={() => handlePayToClick({ PayTo: vendor , Job: selectedJob?.Name || '' })}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(amounts[Object.keys(amounts)[0]])}</td>
                                                    <td>Paid</td>
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='bold'>Total</td>
                                                <td className='bold'>
                                                    {formatNumber(
                                                        Object.values(billxpaytoxjobPaid)
                                                            .map((amounts) => amounts[Object.keys(amounts)[0]])
                                                            .reduce((total, amount) => total + amount, 0)
                                                    )}
                                                </td>
                                                <td className='bold'>Paid</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                                {/* Ready for paid */}
                                <hr />
                                {Object.keys(billxpaytoxjobReady).length > 0 && (
                                    <table className='table table-hover table-striped mt-3 text-black-50'>
                                        <thead>
                                            <tr>
                                                <th>Vendor</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {billxpaytoxjobReady &&
                                                Object.entries(billxpaytoxjobReady).map(([vendor, amounts]) => (
                                                    <tr key={vendor} onClick={() => handlePayToClick({ PayTo: vendor , Job: selectedJob?.Name || '' })}>
                                                        <td>{vendor}</td>
                                                        <td>{formatNumber(amounts[Object.keys(amounts)[0]])}</td>
                                                        <td>Paid</td>
                                                    </tr>
                                                ))}
                                            <tr>
                                                <td className='bold'>Total</td>
                                                <td className='bold'>
                                                    {formatNumber(
                                                        Object.values(billxpaytoxjobReady)
                                                            .map((amounts) => amounts[Object.keys(amounts)[0]])
                                                            .reduce((total, amount) => total + amount, 0)
                                                    )}
                                                </td>
                                                <td className='bold'>Ready For Payment</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                                <hr />
                            </div>
                            <div className='bill'>
                                <div className="title">Purchase order:</div>
                                {Object.keys(poxPerformedbyxJobNotPaid).length > 0 && (
                                    <table className='table table-hover table-striped mt-3 text-black-50'>
                                        <thead>
                                            <tr>
                                                <th>Vendor</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(poxPerformedbyxJobNotPaid).map(([vendor, { TotalCost }]) => (
                                                <tr key={vendor} onClick={() => handleVendorClick({ PerformedBy: vendor, Job: selectedJob?.Name || '' })}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(TotalCost)}</td>
                                                    <td>Not Paid</td>
                                                    {/* <td colSpan={3}>
                                                        <button className='h-10 px-4 font-medium text-sm rounded-md text-white bg-gray-900' onClick={() => handleVendorClick({ PerformedBy: vendor, Job: selectedJob?.Name || '' })}>Ver Detalles</button>
                                                    </td> */}
                                                </tr>
                                            ))}
                                            <tr>
                                                <td className='bold'>Total</td>
                                                <td className='bold'>
                                                    {formatNumber(
                                                        Object.values(poxPerformedbyxJobNotPaid)
                                                            .reduce((total, { TotalCost }) => total + TotalCost, 0)
                                                    )}
                                                </td>
                                                <td className='bold'>Not Paid</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                                

                                {/* partially paid */}
                                <hr />
                                {Object.keys(poxPerformedbyxJobNotPartially).length > 0 && (
                                    <table className='table table-hover table-striped mt-3 text-black-50'>
                                        <thead>
                                            <tr>
                                                <th>Vendor</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {poxPerformedbyxJobNotPartially &&
                                                Object.entries(poxPerformedbyxJobNotPartially).map(([vendor, { TotalCost }]) => (
                                                    <tr key={vendor} onClick={() => handleVendorClick({ PerformedBy: vendor, Job: selectedJob?.Name || '' })}>
                                                        <td>{vendor}</td>
                                                        <td>{formatNumber(TotalCost)}</td>
                                                        <td>Partially Paid</td>
                                                    </tr>
                                                ))}
                                            <tr>
                                                <td className='bold'>Total</td>
                                                <td className='bold'>
                                                    {formatNumber(
                                                        Object.values(poxPerformedbyxJobNotPartially)
                                                            .reduce((total, { TotalCost }) => total + TotalCost, 0)
                                                    )}
                                                </td>
                                                <td className='bold'>Partially Paid</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                                {/* Fully paid */}
                                <hr />
                                {Object.keys(poxPerformedbyxJobNotFully).length > 0 && (
                                    <table className='table table-hover table-striped mt-3 text-black-50'>
                                        <thead>
                                            <tr>
                                                <th>Vendor</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {poxPerformedbyxJobNotFully &&
                                                Object.entries(poxPerformedbyxJobNotFully).map(([vendor, { TotalCost }]) => (
                                                    <tr key={vendor} onClick={() => handleVendorClick({ PerformedBy: vendor, Job: selectedJob?.Name || '' })}>
                                                        <td>{vendor}</td>
                                                        <td>{formatNumber(TotalCost)}</td>
                                                        <td>Fully Paid</td>
                                                    </tr>
                                                ))}
                                            <tr>
                                                <td className='bold'>Total</td>
                                                <td className='bold'>
                                                    {formatNumber(
                                                        Object.values(poxPerformedbyxJobNotFully)
                                                            .reduce((total, { TotalCost }) => total + TotalCost, 0)
                                                    )}
                                                </td>
                                                <td className='bold'>Fully Paid</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                <Modalpo isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} poData={poData} />
                <Modalbill isOpen={isModalOpenb} onClose={() => setIsModalOpenb(false)} billData={billData} />
        </>
    )
}
