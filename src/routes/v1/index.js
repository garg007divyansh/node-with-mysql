import { Router } from "express";
import routes from './routes.js';

const router = Router();

router.use('/v1/dummy/', routes);

export default router;

