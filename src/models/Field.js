import { observable, action, computed, toJS } from 'mobx';
import schema from 'async-validator';
import { FIELD_META_PROP } from '../constants';

export default class Field {
  fields = {};// 表单项，重绘时实时记录
  rules = {};
  @observable data = {};// 表单数据，onChange 时实时收集
  @observable errors = {};
  @observable statuses = {};

  @action
  onChange(name, value){
    this.data[name] = value;
  }

  @action
  setError(name, error){
    this.errors[name] = error;
  }

  @action
  setErrors(errors){
    this.errors = errors;
  }

  init = (name, opts = {}) => {
    const { rules } = opts;

    console.log('init')
    // 注册校验规则，校验规则仍需实时删除？？？
    if ( rules ) this.rules[name] = rules;

    return {
      [FIELD_META_PROP]: name,
      name,
      ref: this._ref.bind(this, name),
      onChange: event => {
        const { value } = event.target || {};
        this.onChange(name, value);
      }
    }
  }

  // 重绘期间，fields 记录视图中存在的表单项实例
  _ref(name, instance){
    console.log('instance is', instance)
    if ( instance ){
      this.fields[name] = instance;
    } else {
      delete this.fields[name];
      // 重绘元素也将执行 detachRef，校验规则也会消失
      // delete this.rules[name];
    };
    console.log('rules is', this.rules)
  }

  // 校验单个字段
  @action
  validateField(name, cb = () => {}){
    const value = this.values[name];
    const descriptor = { 
      [name]: toJS(this.rules[name])
    };
    const validator = new schema(descriptor);

    validator.validate({ [name]: value }, (errs) => {
      if ( errs ) this.setError(name, errs);
      cb(errs, value);
    });
  }

  // 表单数据全校验
  @action
  validate(cb = () => {}){
    const descriptor = toJS(this.rules);
    const validator = new schema(descriptor);

    validator.validate(this.values, (arr, errs) => {
      if ( errs ) this.setErrors(errs);
      cb(errs, this.values);
    });
  }

  /**
   * 获取表单数据
   * @return 返回表单数据
   */
  @computed
  get values(){
    return toJS(this.data);
  }
}