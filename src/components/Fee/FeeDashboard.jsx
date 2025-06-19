import React, {useEffect, useState} from 'react';
import axios from 'axios';

const FeeDashboard = ({studentId}) => {
  const [feeRecords, setFeeRecords] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [paymentData, setPaymentData] = useState({
    amountPaid: '',
    paymentMethod: 'CREDIT_CARD', // default method; adjust as needed
    studentId: studentId,
    feeRecordId: ''
  });
  const [message, setMessage] = useState('');
  
  // Fetch fee records on load
  useEffect(() => {
    axios.get(`/api/fees/student/${studentId}`)
      .then((res) => setFeeRecords(res.data))
      .catch((err) => console.error(err));
  }, [studentId]);
  
  // Fetch payment history on load
  useEffect(() => {
    axios.get(`/api/fees/payments/student/${studentId}`)
      .then((res) => setPaymentHistory(res.data))
      .catch((err) => console.error(err));
  }, [studentId]);
  
  const handlePaymentChange = (e) => {
    const {name, value} = e.target;
    setPaymentData(prevState => ({...prevState, [name]: value}));
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    axios.post('/api/fees/payment', paymentData)
      .then((res) => {
        setMessage('Payment Successful!');
        // refresh payment history
        axios.get(`/api/fees/payments/student/${studentId}`)
          .then((res) => setPaymentHistory(res.data));
      })
      .catch((err) => {
        console.error(err);
        setMessage('Payment failed. Please try again.');
      });
  };
  
  return (
    <div>
      <h2>Fee Dashboard</h2>
      
      <section>
        <h3>Fee Records</h3>
        <ul>
          {feeRecords.map(record => (
            <li key={record.id}>
              Course: {record.courseId} | Total Fee: {record.totalFee} |
              Due: {record.dueAmount} by {record.dueDate} | {record.fullyPaid ? 'Paid' : 'Pending'}
            </li>
          ))}
        </ul>
      </section>
      
      <section>
        <h3>Process Payment</h3>
        <form onSubmit={handlePaymentSubmit}>
          <div>
            <label>Fee Record ID:</label>
            <input
              type="number"
              name="feeRecordId"
              value={paymentData.feeRecordId}
              onChange={handlePaymentChange}
              required/>
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              name="amountPaid"
              value={paymentData.amountPaid}
              onChange={handlePaymentChange}
              required/>
          </div>
          <div>
            <label>Payment Method:</label>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handlePaymentChange}>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="NET_BANKING">Net Banking</option>
              <option value="CASH">Cash</option>
              <option value="CHEQUE">Cheque</option>
            </select>
          </div>
          <button type="submit">Make Payment</button>
        </form>
        {message && <p>{message}</p>}
      </section>
      
      <section>
        <h3>Payment History</h3>
        <ul>
          {paymentHistory.map(payment => (
            <li key={payment.id}>
              Amount: {payment.amountPaid} on {payment.paymentDate} via {payment.paymentMethod}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FeeDashboard;