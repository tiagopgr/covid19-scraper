const mongoose = require('mongoose');

const InformationSchema = mongoose.Schema({
    confirmadosbr: {
        type: Number,
        required: true,
    },
    obitosbr: {
        type: Number,
        required: true,
    },
    confirmadosce: {
        type: Number,
        required: true,
    },
    obitosce: {
        type: Number,
        required: true,
    },
    timestamp: {
        type: Date,
        default: new Date(),
        required: true,
    },
});

mongoose.model('Information', InformationSchema);
