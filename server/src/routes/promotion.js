import express from "express";
const router = express.Router();
import { promotion } from "../controllers/promotion.js";

router.post('/',promotion);

export default router;