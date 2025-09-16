import express from 'express';
import bodyParser from 'body-parser'

import authRoutes from './authRoutes'
import candidateRoutes from './candidateRoutes';
import jobRoutes from './jobPositionRoutes';
import applicationRoutes from './applicationRoutes';
import interviewRoutes from './interviewRoutes';
import dashboardRoutes from './dashboardRoutes'
const router = express.Router();

router.use(bodyParser.urlencoded({extended: true}));

router.use(bodyParser.json());

router.use('/auth',authRoutes)
router.use('/can',candidateRoutes)
router.use('/job',jobRoutes)
router.use('/app',applicationRoutes)
router.use('/inter',interviewRoutes)
router.use('/dash',dashboardRoutes)


export default router;