import { Router } from "express";
import {
  getCategories_handler,
  listStudyMaterials,
  getStudyMaterial,
  getStudyMaterialsByCategory,
  createStudyMaterial,
  updateStudyMaterial,
  deleteStudyMaterial,
} from "../controllers/study-materials.controller.mjs";

const router = Router();

router.get("/categories", getCategories_handler);
router.get("/", listStudyMaterials);
router.get("/category/:category", getStudyMaterialsByCategory);
router.get("/:id", getStudyMaterial);
router.post("/", createStudyMaterial);
router.put("/:id", updateStudyMaterial);
router.delete("/:id", deleteStudyMaterial);

export default router;
