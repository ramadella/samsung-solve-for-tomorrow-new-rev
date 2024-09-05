import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import userRoute from "./routes/UserRoute.js";

const app = express();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Route setup
app.use('/users', userRoute);

app.listen(5000, () => {
    console.log('Server Running...');
});
