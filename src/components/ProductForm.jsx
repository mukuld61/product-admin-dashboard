"use client";

import { useRef, useState } from "react";
import { validateProduct } from "@/lib/validateProduct";

const EMPTY = {
  title: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  thumbnail: "",
  description: "",
};

export default function ProductForm({ initialValues, categories, onSubmit, submitLabel }) {
  const [fields, setFields] = useState({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Same double-submit guard used on the login form: a ref updates
  // instantly, so a second click inside the same tick is still blocked.
  const submittingRef = useRef(false);

  function handleChange(field, value) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;

    const nextErrors = validateProduct(fields);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    submittingRef.current = true;
    setSubmitting(true);
    setSubmitError("");

    try {
      await onSubmit({
        title: fields.title.trim(),
        category: fields.category.trim(),
        price: Number(fields.price),
        stock: Number(fields.stock),
        rating: fields.rating === "" ? 0 : Number(fields.rating),
        thumbnail: fields.thumbnail.trim(),
        description: fields.description.trim(),
      });
    } catch (err) {
      setSubmitError(err.message);
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const inputClass = (field) =>
    `mt-1 w-full rounded-md border px-3 py-2 text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700 ${
      errors[field] ? "border-red-400" : "border-slate-300"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl space-y-4">
      {submitError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <label className="block text-sm font-medium text-slate-800">
        Title
        <input
          className={inputClass("title")}
          value={fields.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Category
        <input
          list="category-options"
          className={inputClass("category")}
          value={fields.category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="e.g. beauty"
        />
        <datalist id="category-options">
          {categories.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-sm font-medium text-slate-800">
          Price ($)
          <input
            type="number"
            step="0.01"
            className={inputClass("price")}
            value={fields.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </label>

        <label className="block text-sm font-medium text-slate-800">
          Stock
          <input
            type="number"
            className={inputClass("stock")}
            value={fields.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
          />
          {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
        </label>
      </div>

      <label className="block text-sm font-medium text-slate-800">
        Rating (0-5, optional)
        <input
          type="number"
          step="0.1"
          className={inputClass("rating")}
          value={fields.rating}
          onChange={(e) => handleChange("rating", e.target.value)}
        />
        {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Thumbnail URL (optional)
        <input
          className={inputClass("thumbnail")}
          value={fields.thumbnail}
          onChange={(e) => handleChange("thumbnail", e.target.value)}
          placeholder="https://..."
        />
        {errors.thumbnail && <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>}
      </label>

      <label className="block text-sm font-medium text-slate-800">
        Description
        <textarea
          rows={4}
          className={inputClass("description")}
          value={fields.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-md bg-teal-700 px-4 py-2 font-medium text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
