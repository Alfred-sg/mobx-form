export function isObject(obj){
  return typeof obj === 'object' && !Array.isArray(obj);
}

export function normalizeValidateRules(validate, rules, validateTrigger) {
  const validateRules = validate.map(item => ({
    ...item,
    trigger: typeof newItem.item === 'string' ? [item.trigger] : item.trigger || []
  }));

  if (rules)
    validateRules.push({
      trigger: validateTrigger ? [].concat(validateTrigger) : [],
      rules,
    });
  
  return validateRules.filter(item => !!item.rules && item.rules.length);
}

export function getValidateTriggers(validateRules) {
  return validateRules.map(item => item.trigger)
    .reduce((pre, curr) => pre.concat(curr), []);
}

export function getValueFromEvent(e){
  if (!e || !e.target) return e;
  const { target } = e;
  return target.type === 'checkbox' ? target.checked : target.value;
}