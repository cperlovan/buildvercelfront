import './stylejobquery.css'

interface billData {
    id: number;
    BillTitle: string;
    PayTo: string
    BillAmount: number;
    BillStatus: string;

}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    billData: billData[];
}

const formatNumber = (number: number | bigint) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(number)
}

function Modalbill({ isOpen, onClose, billData }: ModalProps) {
    return (
        <div className="modal" style={{ display: isOpen ? 'block' : 'none' }}>
            <div className="modal-content">
                <span className="close h-7 w-7 font-bold text-xl rounded-md text-white text-center bg-gray-900" onClick={onClose}>&times;</span>

                <h2>Bills details</h2>
                <h5>{ billData && billData[0]?.PayTo}</h5>

                <table className="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                            <th scope="col" className="px-4 py-3">Title</th>
                            <th scope="col" className="px-4 py-3">Status</th>
                            <th scope="col" className="px-4 py-3 text-end">Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {billData.map((billItem) => (
                            <tr key={billItem.id}>
                                <td>{billItem.BillTitle}</td>
                                <td>{billItem.BillStatus}</td>
                                <td className="text-end">{formatNumber(billItem.BillAmount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default Modalbill