import User from "../models/UserModel.js";
import { Op } from 'sequelize';

export const getUsers = async (req, res) => {
    try {
        // Get pagination parameters from query
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || Number.MAX_SAFE_INTEGER; 
        const offset = (page - 1) * limit;

        // Fetch users with pagination
        const { count, rows } = await User.findAndCountAll({
            limit: limit,
            offset: offset
        });

        res.status(200).json({
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            users: rows
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getUserColors = async (req, res) => {
    try {
        // Fetch all users and their colors
        const users = await User.findAll({ attributes: ['color'] });

        // Categorize colors
        const colorCounts = users.reduce((acc, user) => {
            acc[user.color] = (acc[user.color] || 0) + 1;
            return acc;
        }, {});

        // Send the colorCounts as a JSON response
        res.status(200).json(colorCounts);
    } catch (error) {
        console.error('Error fetching user colors:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getAverageColorPercentages = async (req, res) => {
    try {
        // Query to get counts for each color (red, orange, yellow)
        const colorCounts = await User.findAll({
            attributes: [
                'color',
                [User.sequelize.fn('COUNT', User.sequelize.col('color')), 'count']
            ],
            where: {
                color: {
                    [Op.in]: ['red', 'orange', 'yellow']
                }
            },
            group: 'color'
        });

        // Query to get the total number of users
        const totalCount = await User.count();

        if (totalCount === 0) {
            return res.status(400).json({ message: "No users found." });
        }

        if (colorCounts.length === 0) {
            return res.status(400).json({ message: "No colors found." });
        }

        // Calculate average percentage for each color
        const colorData = colorCounts.reduce((acc, row) => {
            const color = row.color;
            const count = row.get('count');
            acc[color] = (count / totalCount) * 100;
            return acc;
        }, {});

        res.status(200).json(colorData);
    } catch (error) {
        console.error('Error fetching average color percentages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get user by ID
export const getUsersById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        if (response) {
            res.status(200).json(response);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new user
export const createUser = async (req, res) => {
    try {
        console.log(req.body); // Debugging line

        const { name, latitude, longitude, color } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!name || !latitude || !longitude || !color) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        await User.create({
            name,
            latitude,
            longitude,
            image,
            color
        });

        res.status(201).json({ msg: "User Created" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, latitude, longitude, color } = req.body;
        const image = req.file ? req.file.filename : null;

        // Cek apakah user dengan ID tersebut ada
        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update fields yang diberikan, termasuk gambar jika ada
        const updatedData = {
            name: name || user.name,
            latitude: latitude || user.latitude,
            longitude: longitude || user.longitude,
            color: color || user.color,
        };

        if (image) {
            updatedData.image = image; 
        }

        await User.update(updatedData, { where: { id } });

        const updatedUser = await User.findOne({ where: { id } });
        res.status(200).json({ msg: "User Updated", user: updatedUser });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the user
        const deleted = await User.destroy({
            where: { id }
        });

        if (deleted) {
            res.status(200).json({ msg: "User Deleted" });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
