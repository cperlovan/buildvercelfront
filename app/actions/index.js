import axios from "axios";



export function getJobs() {
  return async function (dispatch) {
    try {
      var json = await axios.get("http://localhost:3001/jobs", {});
      return dispatch({
        type: 'GET_ALL_JOBS',
        payload: json.data
      })
    } catch (error) {
      alert(error)
    }

  }
}

export function getPo() {
  return async function (dispatch) {

    try {
      var json = await axios.get("http://localhost:3001/po", {});
      return dispatch({
        type: 'GET_ALL_PO',
        payload: json.data
      })
    } catch (error) {
      alert(error)
    }

  }
}

export function getBills() {
  return async function (dispatch) {
    try {
      var json = await axios.get("http://localhost:3001/bills", {});
      return dispatch({
        type: 'GET_ALL_BILLS',
        payload: json.data
      })
    } catch (error) {
      alert(error)
    }

  }
}

export const postJobs = (data) => {
  
  const newJobs = []
  return async (dispatch) => {
    for (let i = 0; i < data.length; i++) {

      newJobs.push({
        Name: data[i].Name,
        StreetAddress: data[i].StreetAddress || '-',
        State: data[i].State || '-',
        ActualCompletion: data[i].ActualCompletion,
        ActualStart: data[i].ActualStart,
        AmountInvoiced: parseFloat(data[i].AmountInvoiced) || 0,
        ContractPrice: parseFloat(data[i].ContractPrice) || 0, 
        CostsOutstanding: parseFloat(data[i].CostsOutstanding) || 0,
        CostsPaid: parseFloat(data[i].CostsPaid) || 0,
        JobRunningTotal: parseFloat(data[i].JobRunningTotal) || 0,
        PaymentsReceived: parseFloat(data[i].PaymentsReceived)|| 0,
        ProjCompletion: data[i].ProjCompletion,
        ProjStart: data[i].ProjStart,
        TotalCosts: parseFloat(data[i].TotalCosts)|| 0
      })
    } 
    try { 
      await axios.post("http://localhost:3001/jobs", newJobs);
      dispatch(getJobs());
    } catch (error) {
      console.log(error);
    }
  };
};

export const postPo = (data) => {
  const newPo = []

  return async (dispatch) => {

    for (let i = 0; i < data.length; i++) {

      newPo.push({
        "title": data[i].Title,
        "ponumber": data[i].PO,
        "variancecode": data[i].Variacecode || "-",
        "costcode": data[i].CostCode || "-",
        "performedby": data[i].PerformedBy || "-",
        "estcomplete": data[i].EstComplete || "-",
        "postatus": data[i].POStatus || "-",
        "workstatus": data[i].WorkStatus || "-",
        "paid": data[i].Paid || "-",
        "cost": data[i].Cost || 0,
        "job": data[i].Job
      })
    }
    try {
      await axios.post("http://localhost:3001/po", newPo);
      dispatch(getPo());
      
    } catch (error) {
      console.log(error);
    }

  };
};

export const postBills = (data) => {

  const newBill = []
  
  return async (dispatch) => {
    for (let i = 0; i < data.length; i++) {
      newBill.push({
        "bill": data[i].Bill,
        "title": data[i].BillTitle,
        "payto": data[i].PayTo || "-",
        "billamount": data[i].BillAmount || 0,
        "invoicedate": data[i].InvoiceDate,
        "duedate": data[i].DueDate,
        "billstatus": data[i].BillStatus || "-",
        "datepaid": data[i].DatePaid,
        "paydby": data[i].PaidBy || "-",
        "createdate": data[i].CreatedDate,
        "files": data[i].Files || "-",
        "comments": data[i].Comments || "-",
        "variancecode": data[i].VarianceCodes || "-",
        "costcode": data[i].CostCodes || "-",
        "relatedpos": data[i].RelatedPOs || "-",
        "lienwaivers": data[i].LienWaivers || "-",
        "job": data[i].Job
      });
    }
    try {
      await axios.post("http://localhost:3001/bills", newBill);
      dispatch(getBills());

    } catch (error) {
      console.log(error);
    }
  };
};

export function poFilterByJob(payload) {
  return {
   type: "PO_FILTER_BY_JOB",
   payload,

 };
}

export function poFilterByPaid(payload) {
  return {
   type: "PO_FILTER_BY_PAID",
   payload,

 };
}


export function getDeleteJob() {
  return {
    type: "GET_DELETE_JOB",
  };
}

export function getDeleteBill() {
  return {
    type: "GET_DELETE_BILLS",
  };
}
export function getDeletePo() {
  return {
    type: "GET_DELETE_PO",
  };
}