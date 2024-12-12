const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['patient', 'nurse'],
    },
    vitals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vitals',
    }],
    tips: [{
        type: String,
    }]
});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.pre("findOneAndUpdate", async function(next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});

UserSchema.pre("findByIdAndUpdate", async function(next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});

UserSchema.pre("updateOne", async function(next) {
    const update = this.getUpdate();
    if (update.password) {
        update.password = await bcrypt.hash(update.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);