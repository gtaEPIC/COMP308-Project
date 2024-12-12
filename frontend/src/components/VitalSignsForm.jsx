import React, { useState } from 'react';
import {gql, useMutation} from "@apollo/client";
import {useNavigate, useParams} from "react-router-dom";

const ADD_VITAL = gql`
    mutation AddVital($patient: ID!, $bodyTemp: Int!, $heartRate: Int!, $bloodPressure: Int!, $respiratoryRate: Int!) {
        AddVitals(patient: $patient, bodyTemp: $bodyTemp, heartRate: $heartRate, bloodPressure: $bloodPressure, respiratoryRate: $respiratoryRate) {
            id
            patient {
                id
                username
                type
            }
            user {
                id
                username
                type
            }
            date
            bodyTemp
            heartRate
            bloodPressure
            respiratoryRate
        }
    }
`;

const VitalSignsForm = () => {
    const { patientId } = useParams();
  const [bodyTemperature, setBodyTemperature] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [respiratoryRate, setRespiratoryRate] = useState('');

  const [addVital] = useMutation(ADD_VITAL);

  // Navigation
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await addVital({
            variables: {
                patient: patientId,
                bodyTemp: parseInt(bodyTemperature),
                heartRate: parseInt(heartRate),
                bloodPressure: parseInt(bloodPressure),
                respiratoryRate: parseInt(respiratoryRate)
            }
        });

        if (response.errors) {
            alert("An error occurred. Please check the console for more information.");
            console.error(response.errors);
        }else{
            alert("Vital signs added successfully");
            navigate(`/patient/${patientId}`);
        }
    }catch (e) {
        alert("An error occurred. Please check the console for more information.");
        console.error(e);
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