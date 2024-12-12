const Vitals = require('../models/vitals.model');

// Create a new vitals entry
const createVitals = async (_, args, {user}) => {
    if (!user) {
        throw new Error('Unauthorized');
    }
    const vitals = new Vitals({...args, user: user.id});
    vitals.save();

    return vitals.populate(['user', 'patient']);
}

// Read vitals by patient ID
const readVitalsByPatientId = async (_, {patient}, {user}) => {
    if (!user) {
        throw new Error('Unauthorized');
    }
    // If the user is a patient, they can only read their own vitals
    // Nurses can read any patient's vitals
    if (user.type === 'patient' && user.id !== patient) {
        throw new Error('Unauthorized');
    }
    return Vitals.find({ patient }).populate(['user', 'patient']);
}

const addVitalSigns = async (parent, args, context) => {
    const { patientId, bodyTemperature, heartRate, bloodPressure, respiratoryRate } = args;
    const patient = await Patient.findById(patientId);
    if (!patient) throw new Error("Patient not found");
  
    patient.vitalSigns.push({ bodyTemperature, heartRate, bloodPressure, respiratoryRate });
    await patient.save();
    return "Vital signs added successfully";
  };

module.exports = {
    createVitals,
    readVitalsByPatientId
};