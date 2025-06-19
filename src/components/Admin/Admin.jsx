import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Admin = () => {
  const [payments, setPayments] = useState([]);
  const [page, setPage] = useState(0); // initial page index
  const [size, setSize] = useState(10); // records per page
  const [totalPages, setTotalPages] = useState(0);
  const [penaltyData, setPenaltyData] = useState({studentId: '', penaltyAmount: ''});
  const [message, setMessage] = useState('');
  
  // Fetch paginated payment report
  const fetchPaymentReport = (page, size) => {
    axios.get(`/api/admin/payments/report?page=${page}&size=${size}`)
      .then((res) => {
        setPayments(res.data.content); // assuming Pageable response holds content
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };
  
  useEffect(() => {
    fetchPaymentReport(page, size);
  }, [page, size]);
  
  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };
  
  const handlePenaltyChange = (e) => {
    const {name, value} = e.target;
    setPenaltyData(prev => ({...prev, [name]: value}));
  };
  
  const handlePenaltySubmission = (e) => {
    e.preventDefault();
    axios.post(`/api/admin/overdue/${penaltyData.studentId}?penaltyAmount=${penaltyData.penaltyAmount}`)
      .then((res) => {
        setMessage('Penalty applied successfully');
      })
      .catch((err) => {
        console.error(err);
        setMessage('Failed to apply penalty');
      });
  };
  
  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <section>
        <h3>Finance Report</h3>
        <table border="1">
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
          {payments.map(payment => (
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
        <div>
          <button onClick={() => handlePageChange(page - 1)} disabled={page === 0}>Prev</button>
          <span>{page + 1} / {totalPages}</span>
          <button onClick={() => handlePageChange(page + 1)} disabled={page + 1 === totalPages}>Next</button>
        </div>
      </section>
      
      <section>
        <h3>Apply Penalty</h3>
        <form onSubmit={handlePenaltySubmission}>
          <div>
            <label>Student ID:</label>
            <input
              type="number"
              name="studentId"
              value={penaltyData.studentId}
              onChange={handlePenaltyChange}
              required/>
          </div>
          <div>
            <label>Penalty Amount:</label>
            <input
              type="number"
              name="penaltyAmount"
              value={penaltyData.penaltyAmount}
              onChange={handlePenaltyChange}
              required/>
          </div>
          <button type="submit">Apply Penalty</button>
        </form>
        {message && <p>{message}</p>}
      </section>
    </div>
  );
};

export default Admin;