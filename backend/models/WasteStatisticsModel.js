import { DataTypes } from 'sequelize';
import sequelize from '../config/Database.js';

const WasteStatistics = sequelize.define('WasteStatistic', {
    metric_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    area_covered: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    percentage: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    tableName: 'waste_statistics',
    timestamps: false
});

export default WasteStatistics;
