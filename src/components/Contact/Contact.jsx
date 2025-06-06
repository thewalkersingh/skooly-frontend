import React, {useState} from 'react';
import '../../styles/Contact.css';

export default function Contact() {
  const [form, setForm] = useState({name: '', email: '', message: ''});
  
  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Submitted:', form);
    alert('Contact form functionality will be added later!');
  };
  
  return (
    <div className="form-container">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Message:</label>
          <textarea name="message" value={form.message} onChange={handleChange} required/>
        </div>
        <button type="submit" className="btn btn-primary submit-btn">Send Message</button>
      </form>
    </div>
  );
}