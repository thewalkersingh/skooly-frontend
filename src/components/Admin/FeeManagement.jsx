// FeeManagement.jsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const FeeManagement = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [penaltyMessage, setPenaltyMessage] = useState('');
  const [penaltyData, setPenaltyData] = useState({
    studentId: '',
    penaltyAmount: ''
  });
  
  const fetchPayments = (page, size) => {
    axios
      .get(`/api/admin/payments/report?page=${page}&size=${size}`)
      .then((response) => {
        // Assuming your API returns a paginated object with a content field
        setPayments(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => console.error(err));
  };
  
  useEffect(() => {
    fetchPayments(page, size);
  }, [page, size]);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  
  const handlePenaltyChange = (e) => {
    const {name, value} = e.target;
    setPenaltyData((prev) => ({...prev, [name]: value}));
  };
  
  const handlePenaltySubmit = (e) => {
    e.preventDefault();
    axios
      .post(`/api/admin/overdue/${penaltyData.studentId}?penaltyAmount=${penaltyData.penaltyAmount}`)
      .then((response) => {
        setPenaltyMessage('Penalty applied successfully!');
      })
      .catch((err) => {
        console.error(err);
        setPenaltyMessage('Failed to apply penalty.');
      });
  };
  
  return (
    <div>
      <h2>Fee Management</h2>
      
      <h3>Payment Report</h3>
      <table border="1" cellPadding="5">
        <thead>
        <tr>
          <th>ID</th>
          <th>Student ID</th>
          <th>Amount Paid</th>
          <th>Payment Date</th>
          <th>Payment Method</th>
        </tr>
        </thead>
        <tbody>
        {payments.map((payment) => (
          <tr key={payment.id}>
            <td>{payment.id}</td>
            <td>{payment.studentId}</td>
            <td>{payment.amountPaid}</td>
            <td>{payment.paymentDate}</td>
            <td>{payment.paymentMethod}</td>
          </tr>
        ))}
        </tbody>
      </table>
      <div style={{margin: '10px 0'}}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>
          Prev
        </button>
        <span style={{margin: '0 10px'}}>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 === totalPages}>
          Next
        </button>
      </div>
      
      <h3>Apply Penalty</h3>
      <form onSubmit={handlePenaltySubmit}>
        <div>
          <label>Student ID:</label>
          <input
            type="number"
            name="studentId"
            value={penaltyData.studentId}
            onChange={handlePenaltyChange}
            required
          />
        </div>
        <div>
          <label>Penalty Amount:</label>
          <input
            type="number"
            name="penaltyAmount"
            value={penaltyData.penaltyAmount}
            onChange={handlePenaltyChange}
            required
          />
        </div>
        <button type="submit">Apply Penalty</button>
      </form>
      {penaltyMessage && <p>{penaltyMessage}</p>}
    </div>
  );
};

export default FeeManagement;