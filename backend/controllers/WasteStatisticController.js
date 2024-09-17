import WasteStatistic from '../models/WasteStatisticsModel.js';

export const getWasteStatistics = async (req, res) => {
    try {
        const wasteStatistics = await WasteStatistic.findAll();
        res.status(200).json(wasteStatistics);
    } catch (error) {
        console.error('Error fetching waste statistics:', error);
        res.status(500).json({ message: 'Error fetching waste statistics' });
    }
};
