import express from 'express';
import upload from '../middleware/upload.js'; // Import multer configuration
import { getUsers, getUsersById, createUser, updateUser, deleteUser } from '../controllers/UserController.js';

const router = express.Router();

// Get all users
router.get('/', getUsers);

// Get user by ID
router.get('/:id', getUsersById);

// Create a new user with image upload
router.post('/', upload.single('image'), createUser); // Handle image uploads


router.patch('/:id', upload.single('image'), updateUser); // Handle image uploads for update

// Delete a user by ID
router.delete('/:id', deleteUser);
export default router;
