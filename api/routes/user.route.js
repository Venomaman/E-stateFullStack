import express from 'express';
import { test } from '../controllers/user.controller.js';

const router = express.Router();

//test logic getting from user controller file...
router.get('/', test)

export default router;