import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class Col extends Component {
  static propTypes = {
    span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    order: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    push: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pull: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    className: PropTypes.string,
    children: PropTypes.node,
    xs: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    sm: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    md: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    lg: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    xl: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    xxl: PropTypes.oneOfType([PropTypes.object, PropTypes.number])
  };

  render() {
    const { span, order, offset, push, pull, className, children, prefixCls = 'mobx-form-col', ...rest } = this.props;
    let sizeClassObj = {};
    ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].forEach(function (size) {
      const sizeProp = rest[size];
      let sizeProps = {};
      if (typeof sizeProp === 'number') {
        sizeProps.span = props[size];
      } else if (typeof sizeProp === 'object') {
        sizeProps = props[size] || {};
      }
      delete rest[size];
      sizeClassObj = {
        [`${prefixCls}-${size}-${sizeProps.span}`]: sizeProps.span !== undefined, 
        [`${prefixCls}-${size}-order-${sizeProps.order}`]: sizeProps.order || sizeProps.order === 0, 
        [`${prefixCls}-${size}-offset-${sizeProps.offset}`]: sizeProps.offset || sizeProps.offset === 0, 
        [`${prefixCls}-${size}-push-${sizeProps.push}`]: sizeProps.push || sizeProps.push === 0, 
        [`${prefixCls}-${size}-pull-${sizeProps.pull}`]: sizeProps.pull || sizeProps.pull === 0
      };
    });
    const classes = classnames({
      [`${prefixCls}-${span}`]: span !== undefined, 
      [`${prefixCls}-order-${order}`]: order, 
      [`${prefixCls}-offset-${offset}`]: offset, 
      [`${prefixCls}-push-${push}`]: push, 
      [`${prefixCls}-pull-${pull}`]: pull, 
      [className]: true, 
      ...sizeClassObj
    });

    return <div {...rest} className={classes}>{children}</div>;
  }

}