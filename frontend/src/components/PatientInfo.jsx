import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PATIENT_INFO = gql`
  query GetPatientInfo($patientId: ID!) {
    patient(id: $patientId) {
      id
      name
      vitalSigns {
        bodyTemperature
        heartRate
        bloodPressure
        respiratoryRate
      }
      emergencyAlert {
        id
        active
      }
    }
  }
`;

const CREATE_ALERT = gql`
  mutation CreateAlert($patientId: ID!) {
    createAlert(patientId: $patientId) {
      id
    }
  }
`;

const RESOLVE_ALERT = gql`
  mutation ResolveAlert($id: ID!) {
    resolveAlert(id: $id)
  }
`;

const PatientInfo = () => {
  const { patientId } = useParams();
  const { loading, error, data } = useQuery(GET_PATIENT_INFO, { variables: { patientId } });
  const [createAlert] = useMutation(CREATE_ALERT);
  const [resolveAlert] = useMutation(RESOLVE_ALERT);

  const handleCreateAlert = async () => {
    await createAlert({ variables: { patientId } });
    window.location.reload();
  };

  const handleResolveAlert = async (alertId) => {
    await resolveAlert({ variables: { id: alertId } });
    window.location.reload();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const { patient } = data;

  return (
    <div>
      <h1>Patient Information</h1>
      {patient.emergencyAlert && patient.emergencyAlert.active ? (
        <div>
          <h2>Active Emergency Alert</h2>
          {patient.emergencyAlert.active && (
            <button onClick={() => handleResolveAlert(patient.emergencyAlert.id)}>Resolve</button>
          )}
        </div>
      ) : (
        <button onClick={handleCreateAlert}>Create Emergency Alert</button>
      )}
      <h2>Vital Signs</h2>
      <ul>
        {patient.vitalSigns.map((vital, index) => (
          <li key={index}>
            Body Temperature: {vital.bodyTemperature}, Heart Rate: {vital.heartRate}, Blood Pressure: {vital.bloodPressure}, Respiratory Rate: {vital.respiratoryRate}
          </li>
        ))}
      </ul>
      <Link to={`/patient/${patientId}/newvital`}>Add More Vital Information</Link>
      <h2>Common Signs and Symptoms</h2>
      <form>
        <label>
          <input type="checkbox" name="symptom" value="Fever" /> Fever
        </label>
        <label>
          <input type="checkbox" name="symptom" value="Cough" /> Cough
        </label>
        <label>
          <input type="checkbox" name="symptom" value="Shortness of Breath" /> Shortness of Breath
        </label>
        <label>
          <input type="checkbox" name="symptom" value="Fatigue" /> Fatigue
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PatientInfo;