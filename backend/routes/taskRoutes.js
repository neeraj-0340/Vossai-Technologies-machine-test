import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/tasks').post(createTask).get(getTasks);

router.route('/tasks/:id').put(updateTask).delete(deleteTask);

export default router;
