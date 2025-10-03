import express from "express";
import { youtubeController } from "../controllers/youtubeController.js";

const router = express.Router();

router.post("/youtube", youtubeController);

export default router;