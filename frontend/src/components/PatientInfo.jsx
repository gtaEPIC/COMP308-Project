import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PATIENT_INFO = gql`
  query GetUserById($patient: ID!) {
    GetUserById(id: $patient) {
      id
      username
      type
    }
  }
`;

const GET_ALERTS = gql`
  query GetAlerts {
    allAlerts {
      id
      patient
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

const GET_ME = gql`
  query GetMe {
    GetMe {
      id
      username
      type
    }
  }
`;

const GET_VITALS = gql`
  query GetVitals($patient: ID!) {
    GetVitals(patient: $patient) {
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

const PatientInfo = () => {
  const { patientId } = useParams();
  const { loading, error, data } = useQuery(GET_PATIENT_INFO, { variables: { patient: patientId } });
  const { loading: alertsLoading, error: alertsError, data: alertsData } = useQuery(GET_ALERTS);
  const [createAlert] = useMutation(CREATE_ALERT);
  const [resolveAlert] = useMutation(RESOLVE_ALERT);
  const { data: meData } = useQuery(GET_ME);
    const { loading: vitalsLoading, error: vitalsError, data: vitalsData } = useQuery(GET_VITALS, { variables: { patient: patientId } });

  const handleCreateAlert = async () => {
    await createAlert({ variables: { patientId } });
    window.location.reload();
  };

  const handleResolveAlert = async (alertId) => {
    await resolveAlert({ variables: { id: alertId } });
    window.location.reload();
  };

  if (loading || alertsLoading || vitalsLoading) return <p>Loading...</p>;
  if (error || alertsError || vitalsError) return <p>Error: {error.message || alertsError.message || vitalsError.message}</p>;

  const { patient } = data;

  return (
    <div>
      <h1>Patient Information</h1>
      {alertsData && alertsData.allAlerts.find(a => a.patient === patientId) ? (
        <div>
          <h2>Active Emergency Alert</h2>
          {meData && meData.type === 'nurse' && (
            <button onClick={() => handleResolveAlert(patient.emergencyAlert.id)}>Resolve</button>
          )}
        </div>
      ) : (
        <button onClick={handleCreateAlert}>Create Emergency Alert</button>
      )}
      <h2>Vital Signs</h2>
      <ul>
        {vitalsData.GetVitals.map((vital, index) => (
          <li key={index}>
            Body Temperature: {vital.bodyTemp}, Heart Rate: {vital.heartRate}, Blood Pressure: {vital.bloodPressure}, Respiratory Rate: {vital.respiratoryRate}
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