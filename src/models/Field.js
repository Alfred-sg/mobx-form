import { observable, action, computed, toJS } from 'mobx';
import schema from 'async-validator';
import { FIELD_META_PROP } from '../constants';
import { isObject, normalizeValidateRules, getValidateTriggers, getValueFromEvent } from '../utils';

export default class From {
  static defaultOptions = {
    name,
    trigger: 'onChange',
    valuePropName: 'value',
    validate: []
  };

  clearedFieldCache = {};
  metas = {};// 元数据
  instances = {};// 表单实例
  @observable values = {};// 表单数据
  @observable errors = {};// 错误文案
  @observable statuses = {};// 校验状态

  @action
  setValue(name, value) {
    if ( isObject(name) ) this.values = name;
    else this.values[name] = value;
  }

  getValue(name) {
    if ( name ) return toJS(this.values[name]);
    else return toJS(this.values);
  }

  @action
  setError(name, error) {
    if ( isObject(name) ) this.errors = name;
    else this.errors[name] = error;
  }

  getError(name) {
    if ( name ) return toJS(this.errors[name]);
    else return toJS(this.errors);
  }

  @action
  setStatus(name, status) {
    if ( isObject(name) ) this.statuses = name;
    else this.statuses[name] = status;
  }

  getStatus(name) {
    if ( name ) return toJS(this.statuses[name]);
    else return toJS(this.statuses);
  }

  // 获取校验规则
  getValidateRules(name, trigger){
    const { validate } = this.metas[name];
    if ( trigger ){
      return (validate.find(item => item.trigger.indexOf(trigger) !== -1) || {}).rules || [];
    } else {
      return validate.map(item => item.rules)
        .reduce((result, rules) => {
          rules.forEach(rule => {
            if ( result.indexOf(rule) === -1 ) result.push(rule);
          });

          return result;
        }, []);
    };
  }

  @action
  validateField(name, value, trigger, cb) {
    const validator = new schema({
      [name]: this.getValidateRules(name, trigger)
    });
    const values = {
      [name]: value || this.values[name]
    };

    validator.validate(values, (errs) => {
      if (errs) this.setError(name, errs);
      else cb && cb(errs, values);
    });
  }

  // 表单数据全校验
  @action
  validate(cb = () => { }) {
    let descriptor = {};
    Object.keys(this.metas).map(name => {
      descriptor[name] = this.getValidateRules(name);
    });
    const validator = new schema(descriptor);
    const values = this.getValue();

    return new Promise((resolve, reject) => {
      validator.validate(values, (arr, errs) => {
        if ( errs ){
          this.setError(errs);
          reject(errs);
        } else {
          resolve(values);
        };
      });
    })
  }

  init = (name, options = {}) => {
    if (!name) {
      throw new Error('Must call `init` with valid name string!');
    };

    // 混入默认选项
    options = { ...From.defaultOptions, ...options };

    const { validate, rules, trigger, validateTrigger = trigger } = options;
    const validateRules = normalizeValidateRules(validate, rules, validateTrigger);

    // 存储元数据
    this.metas[name] = {
      ...(this.metas[name] || {}),
      ...options,
      validate: validateRules
    };

    return {
      [FIELD_META_PROP]: this.metas[name],
      name,
      ...this.createBoundMethods(name),
      ref: this._ref.bind(this, name)
    }
  }

  createBoundMethods(name) {
    let methods = {};
    const meta = this.metas[name];
    const { validate, trggier: collectTrigger } = meta;
    const validateTriggers = getValidateTriggers(validate);
    validateTriggers.forEach(trigger => {
      methods[trigger] = (...args) => {
        const value = getValueFromEvent(args[0]);
        meta[trigger] && meta[trigger](...args);
        if ( trigger !== collectTrigger ) this.setValue(name, value);
        this.validateField(name, value, trigger);
      };
    });

    return methods;
  }

  // 重绘期间，instances 记录视图中存在的表单项实例
  _ref(name, instance) {
    if (instance) {
      if (this.clearedFieldCache[name]) {
        this.metas[name] = this.clearedFieldCache[name].meta;
        delete this.clearedFieldCache[name];
      };

      // 支持函数形式的 ref
      this.metas[name].ref && this.metas[name].ref(instance);

      this.instances[name] = instance;
    } else {
      // 重绘元素也将执行 detachRef；缓存数据，以便再次使用
      this.clearedFieldCache[name] = {
        meta: this.metas[name]
      };

      delete this.instances[name];
      delete this.metas[name];
      delete this.fieldValues[name];
      delete this.errors[name];
      delete this.statuses[name];
    };
  }
}