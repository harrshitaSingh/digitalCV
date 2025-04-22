
import React from 'react';

const GoogleFormPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
      }}
    >

      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSePGqkLB0OZ6vdKUXB2J5tw1mqqW_a07zKw65EkIwo9f8g4Rw/viewform?embedded=true"
        width="640"
        height="1046"
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        title="Google Form"
        style={{ border: '1px solid #ccc' }}
      >
        Loading…
      </iframe>
    </div>
  );
};

export default GoogleFormPage;
