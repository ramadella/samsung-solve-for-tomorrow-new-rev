import User from "../models/UserModel.js";


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
            updatedData.image = image; // Hanya update gambar jika ada file gambar yang di-upload
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
