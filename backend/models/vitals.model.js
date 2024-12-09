const mongoose = requie('mongoose');

const VitalsSchema = mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        default: Date.now,
    },
    bodyTemp: {
        type: Number,
        required: true,
    },
    heartRate: {
        type: Number,
        required: true,
    },
    bloodPressure: {
        type: Number,
        required: true,
    },
    respiratoryRate: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Vitals', VitalsSchema);