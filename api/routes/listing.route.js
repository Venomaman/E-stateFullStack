import express from 'express';
import { createListing, deleteListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createListing)
router.delete('/delete/:id',verifyToken, deleteListings)


export default router;