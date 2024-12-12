import React, { useState } from 'react';

const VitalSignsForm = ({ patientId }) => {
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/patient/${patientId}/newvital`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bodyTemperature: parseFloat(bodyTemperature),
        heartRate: parseFloat(heartRate),
        bloodPressure,
        respiratoryRate: parseFloat(respiratoryRate)
      })
    });

    if (response.ok) {
      alert('Vital signs added successfully');
      // Redirect to patient's page or clear the form
    } else {
      alert('Error adding vital signs');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Body Temperature:
        <input
          type="number"
          step="0.1"
          value={bodyTemperature}
          onChange={(e) => setBodyTemperature(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Heart Rate:
        <input
          type="number"
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Blood Pressure:
        <input
          type="text"
          value={bloodPressure}
          onChange={(e) => setBloodPressure(e.target.value)}
          required
        />
      </label>
      <br />
      <label>
        Respiratory Rate:
        <input
          type="number"
          step="0.1"
          value={respiratoryRate}
          onChange={(e) => setRespiratoryRate(e.target.value)}
          required
        />
      </label>
      <br />
      <button type="submit">Submit</button>
    </form>
  );
};

export default VitalSignsForm;