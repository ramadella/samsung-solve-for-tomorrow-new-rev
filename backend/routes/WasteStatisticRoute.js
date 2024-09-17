import express from 'express';
import { getWasteStatistics } from '../controllers/WasteStatisticController.js';

const router = express.Router();

router.get('/', getWasteStatistics);

export default router;
