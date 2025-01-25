

import React, { useEffect, useState } from 'react'

import './stylejobquery.css'
import ProgressBar from "./ProgressBar"




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
    const billxpaytoxjobPaid = bil?.reduce<PayToResult>((result, bill: Billsexcel) => {
        // Iteramos sobre los trabajos a analizar
        if (bill.Job === selectedJob?.Name && bill.BillStatus === "Paid") {
            const { PayTo, Job, BillAmount } = bill;
            result[PayTo] = result[PayTo] || {};
            result[PayTo][Job] = (result[PayTo][Job] || 0) + BillAmount;

        }
        return result;
    }, {});

    // ready for payment
    const billxpaytoxjobReady = bil?.reduce<PayToResult>((result, bill: Billsexcel) => {
        // Iteramos sobre los trabajos a analizar
        if (bill.Job === selectedJob?.Name && bill.BillStatus === "Ready For Payment") {
            const { PayTo, Job, BillAmount } = bill;
            result[PayTo] = result[PayTo] || {};
            result[PayTo][Job] = (result[PayTo][Job] || 0) + BillAmount;

        }
        return result;
    }, {});

    // Open - Requested
    // const billxpaytoxjobOpen = bil?.reduce<PayToResult>((result, bill:Billsexcel) => {
    //     // Iteramos sobre los trabajos a analizar
    //     if (bill.Job === selectedJob?.Name && bill.BillStatus === "Open - Requested") {
    //         const { PayTo, Job, BillAmount } = bill;
    //         result[PayTo] = result[PayTo] || {};
    //         result[PayTo][Job] = (result[PayTo][Job] || 0) + BillAmount;

    //       }
    //       return result;
    //   }, {});

    // Purchase order not paid
    const pos: posexcel[] = po
    const poxPerformedbyxJobNotPaid = pos?.reduce<PayToResult>((result, p: posexcel) => {
        // Iteramos sobre los trabajos a analizar
        if (p.Job === selectedJob?.Name && p.Paid === "Not Paid") {
            const { PerformedBy, Job, Cost } = p;
            result[PerformedBy] = result[PerformedBy] || {};
            result[PerformedBy][Job] = (result[PerformedBy][Job] || 0) + Cost;

        }
        return result;
    }, {});

    // Purchase order Partially Paid

    const poxPerformedbyxJobNotPartially = pos?.reduce<PayToResult>((result, p: posexcel) => {
        // Iteramos sobre los trabajos a analizar
        if (p.Job === selectedJob?.Name && p.Paid === "Partially Paid") {
            const { PerformedBy, Job, Cost } = p;
            result[PerformedBy] = result[PerformedBy] || {};
            result[PerformedBy][Job] = (result[PerformedBy][Job] || 0) + Cost;

        }
        return result;
    }, {});


    // Purchase order Fully Paid

    const poxPerformedbyxJobNotFully = pos?.reduce<PayToResult>((result, p: posexcel) => {
        // Iteramos sobre los trabajos a analizar
        if (p.Job === selectedJob?.Name && p.Paid === "Fully Paid") {
            const { PerformedBy, Job, Cost } = p;
            result[PerformedBy] = result[PerformedBy] || {};
            result[PerformedBy][Job] = (result[PerformedBy][Job] || 0) + Cost;

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
                                            {billxpaytoxjobPaid &&
                                                Object.keys(billxpaytoxjobPaid).map(vendor => (
                                                    <tr key={vendor}>
                                                        <td>{vendor}</td>
                                                        <td>{formatNumber(billxpaytoxjobPaid[vendor][Object.keys(billxpaytoxjobPaid[vendor])[0]])} </td>
                                                        <td>Paid</td>
                                                    </tr>
                                                ))}
                                            <tr>
                                                <td className='bold'>Total</td>
                                                <td className='bold'>{billxpaytoxjobPaid &&
                                                    formatNumber(Object.values(billxpaytoxjobPaid)
                                                        .map(obj => Object.values(obj)[0])
                                                        .reduce((total, amount) => total + amount, 0)
                                                    )}</td>
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
                                            Object.keys(billxpaytoxjobReady)?.map(vendor => (
                                                <tr key={vendor}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(billxpaytoxjobReady[vendor][Object.keys(billxpaytoxjobReady[vendor])[0]])} </td>
                                                    <td>Ready For Payment</td>
                                                </tr>
                                            ))}
                                        <tr>
                                            <td className='bold'>Total</td>
                                            <td className='bold'>{billxpaytoxjobReady &&
                                                formatNumber(Object.values(billxpaytoxjobReady)
                                                    .map(obj => Object.values(obj)[0])
                                                    .reduce((total, amount) => total + amount, 0)
                                                )}</td>
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
                                            <th>Perfomed by </th>
                                            <th>Cost</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poxPerformedbyxJobNotPaid &&
                                            Object.keys(poxPerformedbyxJobNotPaid).map(vendor => (
                                                <tr key={vendor}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(poxPerformedbyxJobNotPaid[vendor][Object.keys(poxPerformedbyxJobNotPaid[vendor])[0]])} </td>
                                                    <td>Not Paid</td>
                                                </tr>
                                            ))}
                                        <tr>
                                            <td className='bold'>Total</td>
                                            <td className='bold'>{poxPerformedbyxJobNotPaid &&
                                                formatNumber(Object.values(poxPerformedbyxJobNotPaid)
                                                    .map(obj => Object.values(obj)[0])
                                                    .reduce((total, amount) => total + amount, 0)
                                                )}</td>
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
                                            <th>Perfomed by </th>
                                            <th>Cost</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poxPerformedbyxJobNotPartially &&
                                            Object.keys(poxPerformedbyxJobNotPartially).map(vendor => (
                                                <tr key={vendor}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(poxPerformedbyxJobNotPartially[vendor][Object.keys(poxPerformedbyxJobNotPartially[vendor])[0]])} </td>
                                                    <td>Partially Paid</td>
                                                </tr>
                                            ))}
                                        <tr>
                                            <td className='bold'>Total</td>
                                            <td className='bold'>{poxPerformedbyxJobNotPartially &&
                                                formatNumber(Object.values(poxPerformedbyxJobNotPartially)
                                                    .map(obj => Object.values(obj)[0])
                                                    .reduce((total, amount) => total + amount, 0)
                                                )}</td>
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
                                            <th>Perfomed by </th>
                                            <th>Cost</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {poxPerformedbyxJobNotFully &&
                                            Object.keys(poxPerformedbyxJobNotFully).map(vendor => (
                                                <tr key={vendor}>
                                                    <td>{vendor}</td>
                                                    <td>{formatNumber(poxPerformedbyxJobNotFully[vendor][Object.keys(poxPerformedbyxJobNotFully[vendor])[0]])} </td>
                                                    <td>Fully Paid</td>
                                                </tr>
                                            ))}
                                        <tr>
                                            <td className='bold'>Total</td>
                                            <td className='bold'>{poxPerformedbyxJobNotFully &&
                                                formatNumber(Object.values(poxPerformedbyxJobNotFully)
                                                    .map(obj => Object.values(obj)[0])
                                                    .reduce((total, amount) => total + amount, 0)
                                                )}</td>
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

        </>
    )
}
