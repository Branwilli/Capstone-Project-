import React, { useState } from 'react';

function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent! (Demo)');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="contact-us pt-16 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-secondary mb-4">Contact Us</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="form-label" htmlFor="name">Name</label>
          <input className="form-control" id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="email">Email</label>
          <input className="form-control" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-6">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea className="form-control" id="message" rows="5" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-custom">Send Message</button>
      </form>
    </div>
  );
}

export default ContactUs;