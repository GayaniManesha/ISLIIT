const CATEGORIES = ["Notes", "Short Notes", "Past Papers", "Model Papers", "Quizzes"];

const studyMaterialFields = ["title", "description", "category", "fileName", "uploadedBy"];
const fileContentField = "fileContent";

export function validateStudyMaterialPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  // Validate standard fields
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

  // Validate fileContent separately (can be large base64)
  if (Object.prototype.hasOwnProperty.call(payload ?? {}, fileContentField)) {
    const fileContent = payload[fileContentField];
    if (fileContent && typeof fileContent === "string") {
      value[fileContentField] = fileContent;
    }
  }

  // Check required fields for non-partial updates
  if (!partial) {
    for (const field of studyMaterialFields) {
      if (!value[field]) {
        errors.push(`${field} is required`);
      }
    }
    if (!value[fileContentField] && !partial) {
      errors.push(`${fileContentField} is required`);
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
