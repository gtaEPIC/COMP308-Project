const {EmergencyAlert} = require('../models/EmergencyAlert');

const createAlert = async (parent, args, context) => {
    const { patientId } = args;
    const existingAlert = await EmergencyAlert.findOne({ patient: patientId });
    if (existingAlert) throw new Error("You already have an active alert");

    const alert = new EmergencyAlert({ patient: patientId });
    await alert.save();
    return alert;
};

const resolveAlert = async (parent, args, context) => {
    const { id } = args;
    const alert = await EmergencyAlert.findById(id);
    if (!alert) throw new Error("Alert not found");

    await alert.remove();
    return "Alert resolved";
};

const getAllAlerts = async (parent, args, context) => {
    const {user} = context;
    if (!user) throw new Error("Unauthorized");
    return EmergencyAlert.find();
};

const getAlert = async (parent, args, context) => {
    const { id } = args;
    return EmergencyAlert.findOne({ patient: id });
}

module.exports = { createAlert, resolveAlert, getAllAlerts, getAlert };