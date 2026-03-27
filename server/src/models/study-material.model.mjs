const CATEGORIES = ["Notes", "Short Notes", "Past Papers", "Model Papers", "Quizzes"];

const studyMaterialFields = ["title", "description", "category", "fileUrl", "fileName", "uploadedBy"];

export function validateStudyMaterialPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of studyMaterialFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    const raw = String(payload[field]).trim();
    if (!raw) {
      errors.push(`${field} is required`);
      continue;
    }

    if (field === "category" && !CATEGORIES.includes(raw)) {
      errors.push(`category must be one of: ${CATEGORIES.join(", ")}`);
      continue;
    }

    value[field] = raw;
  }

  if (!partial) {
    for (const field of studyMaterialFields) {
      if (!value[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    value,
  };
}

export function getCategories() {
  return CATEGORIES;
}
