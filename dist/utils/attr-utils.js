export const removeAttribute = (el, attrName) => {
  return el.removeAttribute(attrName);
};
export const getStringAttribute = (el, attrName, defaultValue = "") => {
  var _a;
  return (_a = el.getAttribute(attrName)) != null ? _a : defaultValue;
};
export const setStringAttribute = (el, attrName, value) => {
  return el.setAttribute(attrName, value);
};
export const getBooleanAttribute = (el, attrName, defaultValue = false) => {
  return el.hasAttribute(attrName) || defaultValue;
};
export const setBooleanAttribute = (el, attrName, value) => {
  if (!value)
    return removeAttribute(el, attrName);
  const strValue = "";
  return setStringAttribute(el, attrName, strValue);
};
export const getNumberAttribute = (el, attrName, defaultValue = Number.NaN) => {
  const strValue = getStringAttribute(el, attrName);
  if (!strValue)
    return defaultValue;
  return +strValue;
};
export const setNumberAttribute = (el, attrName, value) => {
  if (Number.isNaN(value))
    return removeAttribute(el, attrName);
  const strValue = `${value}`;
  return setStringAttribute(el, attrName, strValue);
};
export const getArrayAttribute = (el, attrName, defaultValue = [], toArrayValues = (x) => x) => {
  const strValue = getStringAttribute(el, attrName);
  if (!strValue)
    return defaultValue;
  return strValue.split(/\s+/).filter((x) => x).map(toArrayValues);
};
export const setArrayAttribute = (el, attrName, value, toArrayAttrValues = (x) => x) => {
  if (!(value && value.length))
    return removeAttribute(el, attrName);
  const strValue = Array.from(value, toArrayAttrValues).join(" ");
  return setStringAttribute(el, strValue);
};
