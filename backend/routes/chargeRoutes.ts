import express from 'express';
import ChargerService from '../api/services/ChargerService.js';


const r = express.Router()

r.post('/charge-start', (req, res) => {
    ChargerService.setChargeStart();
    res.status(200).json({ msg: 'success' });
});
r.post('/charge-stop', (req, res) => {
    ChargerService.setChargeStop();
    res.status(200).json({ msg: 'success' });
});
export default r;