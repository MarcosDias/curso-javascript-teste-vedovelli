/* istanbul ignore file */
import express from 'express';
import { homeController } from '@/controllers';

export default express.Router().get('/', homeController.index);
