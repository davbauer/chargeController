import express from 'express';
import LiveDataInterface from '../models/LiveDataInterface.js';
import LiveData from '../classes/LiveData.js';


const r = express.Router()

r.get('/livedata', (req, res) => {
    const liveDataObject: LiveDataInterface = LiveData.data;
    res.json(liveDataObject);
});

export default r;