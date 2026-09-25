// Hand-written validation (the assignment prefers this over a form library,
// and it's easier to walk through live). Returns { fieldName: message }.
export function validateProduct(fields) {
  const errors = {};

  if (!fields.title?.trim()) errors.title = "Title is required.";
  else if (fields.title.trim().length < 3) errors.title = "Title must be at least 3 characters.";

  if (!fields.category?.trim()) errors.category = "Category is required.";

  if (fields.price === "" || fields.price === null) errors.price = "Price is required.";
  else if (Number.isNaN(Number(fields.price)) || Number(fields.price) <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  if (fields.stock === "" || fields.stock === null) errors.stock = "Stock is required.";
  else if (!Number.isInteger(Number(fields.stock)) || Number(fields.stock) < 0) {
    errors.stock = "Stock must be a whole number, 0 or more.";
  }

  if (fields.rating !== "" && fields.rating !== null) {
    const r = Number(fields.rating);
    if (Number.isNaN(r) || r < 0 || r > 5) errors.rating = "Rating must be between 0 and 5.";
  }

  if (fields.thumbnail && !/^https?:\/\/.+/.test(fields.thumbnail)) {
    errors.thumbnail = "Thumbnail must be a valid URL (starting with http/https).";
  }

  if (!fields.description?.trim()) errors.description = "Description is required.";

  return errors;
}
