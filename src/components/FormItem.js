import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import RcAnimate from 'rc-animate';
import classnames from 'classnames';
import warning from 'warning';
import { FIELD_META_PROP } from '../constants';
import Row from './Row';
import Col from './Col';
import { Icon } from 'antd';

@observer
export default class FormItem extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    labelCol: PropTypes.object,
    help: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    validateStatus: PropTypes.oneOf(['', 'success', 'warning', 'error', 'validating']),
    hasFeedback: PropTypes.bool,
    wrapperCol: PropTypes.object,
    className: PropTypes.string,
    name: PropTypes.string,
    children: PropTypes.node,
    colon: PropTypes.bool
  };

  static defaultProps = {
    prefixCls: 'mobx-form',
    hasFeedback: false,
    colon: true
  };

  static contextTypes = {
    vertical: PropTypes.bool,
    form: PropTypes.object
  };

  helpShow = false;

  componentDidMount() {
    warning(this.getControls(this.props.children, true).length <= 1,
      '`Form.Item` cannot generate `validateStatus` and `help` automatically, '
      + 'while there are more than one field in it.');
  }

  /**
   * 获取 store 中用于操控表单的 model
   */
  get form() {
    return this.context.form;
  }

  /**
   * 获取所有字段
   */
  getControls = (children, recursively) => {
    let controls = [];
    const childrenArray = React.Children.toArray(children);
    for (var i = 0; i < childrenArray.length; i++) {
      if (!recursively && controls.length > 0) {
        break;
      };
      let child = childrenArray[i];
      if (child.type && (child.type === FormItem || child.type.displayName === 'FormItem')) {
        continue;
      };
      if (!child.props) {
        continue;
      };
      if (FIELD_META_PROP in child.props) {
        controls.push(child);
      } else if (child.props.children) {
        controls = controls.concat(this.getControls(child.props.children, recursively));
      };
    };
    return controls;
  }

  /**
   * 获取字段
   */
  get field() {
    let child = this.getControls(this.props.children, false)[0];
    return child !== undefined ? child : null;
  }

  /**
   * 获取字段名
   */
  get name() {
    return this.field.props.name;
  }

  get help() {
    const errors = this.form.errors[this.name];

    return errors ? errors.map((e, index) => {
      return React.isValidElement(e.message) ? cloneElement(e.message, { key: index }) : e.message;
    }) : '';
  }

  /**
   * 获取校验状态，props 中传入的优先
   */
  get validateStatus() {
    return this.props.statuses || this.form.statuses[this.name];
  }

  /**
   * 是否必填，props 中传入的优先
   */
  get required() {
    return this.props.required !== undefined ? this.props.required
      : (this.form.metas[this.name].validate || []).some(item => item.rules.some(it => it.required));
  }

  /**
   * help 消失时，通过 setState 重绘
   */
  onHelpAnimEnd = (_key, helpShow) => {
    this.helpShow = helpShow;
    if (!helpShow) this.setState({});
  }

  /**
   * label 点击，字段聚焦
   */
  onLabelClick = (e) => {
    const { label } = this.props;
    const name = this.name;
    if (!name) return;

    const controls = document.querySelectorAll(`[name="${name}"]`);
    if (controls.length !== 1) {
      if (typeof label === 'string') e.preventDefault();
      const formItemNode = ReactDOM.findDOMNode(this);
      const control = formItemNode.querySelector(`[name="${name}"]`);
      if (control && control.focus) control.focus();
    }
  }

  /**
   * 渲染 label
   */
  renderLabel = () => {
    const { vertical } = this.context;
    const { prefixCls, label, labelCol, colon, name } = this.props;
    const labelColClassName = classnames(`${prefixCls}-item-label`, labelCol && labelCol.className);
    const labelClassName = classnames({
      [`${prefixCls}-item-required`]: this.required
    });

    return label && (
      <Col {...labelCol} className={labelColClassName} key='label'>
        <label htmlFor={name || this.name} className={labelClassName}
          title={typeof label === 'string' ? label : ''} onClick={this.onLabelClick}>
          {colon && !vertical && typeof label === 'string' && label.trim() !== ''
            ? label.replace(/[：|:]\s*$/, '') : label}
        </label>
      </Col>
    );
  }

  /**
   * 渲染 help
   */
  renderHelp = () => {
    const { prefixCls } = this.props;
    if (this.help) this.helpShow = !!this.help;

    return this.help && (
      <RcAnimate transitionName='show-help' component='' transitionAppear={true}
        key='help' onEnd={this.onHelpAnimEnd}>
        <div className={`${prefixCls}-explain`} key='help'>
          {this.help}
        </div>
      </RcAnimate>
    );
  }

  /**
   * 渲染字段容器
   */
  renderField = () => {
    const { prefixCls, wrapperCol, hasFeedback, extra, children } = this.props;
    const validateStatus = this.validateStatus;
    const wrapperClassName = classnames(`${prefixCls}-item-control-wrapper`, wrapperCol && wrapperCol.className);
    const className = classnames(`${prefixCls}-item-control`, {
      'has-feedback': hasFeedback || validateStatus === 'validating',
      'has-success': validateStatus === 'success',
      'has-warning': validateStatus === 'warning',
      'has-error': validateStatus === 'error',
      'is-validating': validateStatus === 'validating'
    });
    const iconType = validateStatus === 'success' ? 'check-circle'
      : validateStatus === 'warning' ? 'exclamation-circle'
        : validateStatus === 'error' ? 'close-circle'
          : validateStatus === 'validating' ? 'loading' : '';

    return (
      <Col {...wrapperCol} className={wrapperClassName} key='wrapper'>
        <div className={className}>
          <span className={`${prefixCls}-item-children`}>
            {children}
            {hasFeedback && iconType &&
              <span className={`${prefixCls}-item-control`}>
                <Icon type={iconType} theme={iconType === 'loading' ? 'outlined' : 'filled'} />
              </span>}
          </span>
          {this.renderHelp()}
          {extra && <div className={`${prefixCls}-explain`}>{extra}</div>}
        </div>
      </Col>
    );
  }

  render() {
    const { prefixCls, colon, className, style } = this.props;
    const itemClassName = classnames({
      [`${prefixCls}-item`]: true,
      [`${prefixCls}-item-with-help`]: this.helpShow,
      [`${prefixCls}-item-no-colon`]: colon,
      className: !!className
    });

    return (
      <Row className={itemClassName} style={style}>
        {this.renderLabel()}
        {this.renderField()}
      </Row>
    );
  }
};