/**
 * Whether a model name identifies a dictation-cleanup fine-tune.
 *
 * Mirrors `managers::model::is_cleanup_specialist`. The backend copy is the one
 * that matters — it decides how the model is actually prompted — and this copy
 * only drives copy and layout hints, so a drift between them is cosmetic rather
 * than behavioural.
 *
 * It exists because `ModelInfo.is_cleanup_specialist` can only speak for models
 * in the app's own catalog. A user pointing cleanup at their own Ollama or LM
 * Studio endpoint has a bare model string and no `ModelInfo` at all, and the
 * advice about leaving the prompt layers alone applies to them just the same.
 */
export const isCleanupSpecialistModel = (model: string | null | undefined) => {
  if (!model) return false;
  const normalized = model.toLowerCase().replace(/[^a-z0-9]/g, "-");
  // The catalog id, or the name the model's publisher gives the weights
  // (file names, Ollama tags), as `CLEANUP_SPECIALIST_MODEL_IDS` lists them.
  return ["cleanup-mini", "speakoflow-mini"].some((id) =>
    normalized.includes(id),
  );
};
