/**
 * Determines if a model has been changed from its original state. manikin-model models store each
 * property as an own field, so serializing them compares every property.
 * @param {Object} original
 * @param {Object} edited
 * @return {boolean}
 */
const isModelDirty = (original, edited) => JSON.stringify(original) !== JSON.stringify(edited);

export default isModelDirty;
