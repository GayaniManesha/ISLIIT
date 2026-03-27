import { ObjectId } from "mongodb";
import { getDb } from "../config/db.mjs";
import { validateStudyMaterialPayload, getCategories } from "../models/study-material.model.mjs";

const toObjectId = (id) => {
  try {
    return new ObjectId(id);
  } catch (error) {
    return null;
  }
};

export async function getCategories_handler(req, res, next) {
  try {
    const categories = getCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

export async function listStudyMaterials(req, res, next) {
  try {
    const db = await getDb();
    const category = req.query.category;

    let query = {};
    if (category) {
      query.category = category;
    }

    const materials = await db
      .collection("study_materials")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    res.json(materials);
  } catch (error) {
    next(error);
  }
}

export async function getStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const db = await getDb();
    const material = await db
      .collection("study_materials")
      .findOne({ _id: materialId });

    if (!material) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    res.json(material);
  } catch (error) {
    next(error);
  }
}

export async function getStudyMaterialsByCategory(req, res, next) {
  try {
    const category = req.params.category;

    const db = await getDb();
    const materials = await db
      .collection("study_materials")
      .find({ category })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(materials);
  } catch (error) {
    next(error);
  }
}

export async function createStudyMaterial(req, res, next) {
  try {
    const { valid, errors, value } = validateStudyMaterialPayload(req.body);
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    const material = {
      ...value,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const db = await getDb();
    const result = await db.collection("study_materials").insertOne(material);
    res.status(201).json({ _id: result.insertedId, ...material });
  } catch (error) {
    next(error);
  }
}

export async function updateStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const { valid, errors, value } = validateStudyMaterialPayload(req.body, { partial: true });
    if (!valid) {
      res.status(400).json({ error: "Validation failed", details: errors });
      return;
    }

    value.updatedAt = new Date();

    const db = await getDb();
    const result = await db
      .collection("study_materials")
      .findOneAndUpdate(
        { _id: materialId },
        { $set: value },
        { returnDocument: "after" }
      );

    if (!result.value) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    res.json(result.value);
  } catch (error) {
    next(error);
  }
}

export async function deleteStudyMaterial(req, res, next) {
  try {
    const materialId = toObjectId(req.params.id);
    if (!materialId) {
      res.status(400).json({ error: "Invalid material id" });
      return;
    }

    const db = await getDb();
    const result = await db
      .collection("study_materials")
      .deleteOne({ _id: materialId });

    if (result.deletedCount === 0) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }

    res.json({ message: "Study material deleted successfully" });
  } catch (error) {
    next(error);
  }
}
