import { Sequelize, DataTypes } from 'sequelize';
import db from '../config/Database.js';

const User = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: { // Store only the filename
        type: DataTypes.STRING,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
},
{
    freezeTableName: true,
    timestamps: true, // Disable timestamps if not used
});

export default User;

(async () => {
    try {
        await db.sync();
        console.log('User table has been synced successfully.');
    } catch (error) {
        console.error('Error syncing User table:', error);
    }
})();
