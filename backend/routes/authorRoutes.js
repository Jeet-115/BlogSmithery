import express from "express";
import { getAuthorDetails } from "../controllers/authorController.js";

const router = express.Router();

router.get("/:id", getAuthorDetails);

export default router;