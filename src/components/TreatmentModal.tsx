import { Loader2, X } from "lucide-react";
import { TREATMENT_CATEGORIES } from "../config";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface IProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: any;
  register: any;
  handleSubmit: any;
  errors: any;
  isSubmitting: boolean;
  isEditing: boolean;
}
export function TreatmentModal({
  isOpen,
  onClose,
  onSubmit,
  register,
  handleSubmit,
  errors,
  isSubmitting,
  isEditing,
}: IProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Treatment" : "Add Treatment"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Treatment Name *
            </label>
            <input
              {...register("name")}
              type="text"
              className={`input w-full ${errors.name ? "border-red-500" : ""}`}
              placeholder="e.g., General Consultation"
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows="2"
              className={`input ${errors.description ? "border-red-500" : ""}`}
              placeholder="Additional details..."
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                {...register("quantity", { valueAsNumber: true })}
                type="number"
                min="1"
                className={`input ${errors.quantity ? "border-red-500" : ""}`}
                placeholder="1"
                disabled={isSubmitting}
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit Price *
              </label>
              <input
                {...register("unitPrice", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className={`input ${errors.unitPrice ? "border-red-500" : ""}`}
                placeholder="0.00"
                disabled={isSubmitting}
              />
              {errors.unitPrice && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.unitPrice.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register("category")}
              className={`input ${errors.category ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            >
              {TREATMENT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : isEditing ? (
                "Update"
              ) : (
                "Add Treatment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
