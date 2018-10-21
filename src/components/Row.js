import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// matchMedia polyfill for
// https://github.com/WickyNilliams/enquire.js/issues/82
let enquire = void 0;
if (typeof window !== 'undefined') {
  let matchMediaPolyfill = function matchMediaPolyfill(mediaQuery) {
    return {
      media: mediaQuery,
      matches: false,
      addListener: function addListener() { },
      removeListener: function removeListener() { }
    };
  };
  window.matchMedia = window.matchMedia || matchMediaPolyfill;
  enquire = require('enquire.js');
}

const responsiveArray = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];
const responsiveMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

export default class Row extends Component {
  static propTypes = {
    type: PropTypes.string,
    align: PropTypes.string,
    justify: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    gutter: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
    prefixCls: PropTypes.string
  };

  static defaultProps = {
    gutter: 0
  };

  state = {
    screens: {}
  };

  componentDidMount() {
    const { gutter } = this.props;

    Object.keys(responsiveMap).map(screen => {
      return enquire.register(responsiveMap[screen], {
        match: () => {
          if (typeof gutter !== 'object') return;

          this.setState(prevState => {
            return {
              screens: {
                ...prevState.screens,
                [screen]: true
              }
            };
          });
        },
        unmatch: () => {
          if (typeof gutter !== 'object') return;

          this.setState(prevState => {
            return {
              screens: {
                ...prevState.screens,
                [screen]: false
              }
            };
          });
        },
        // Keep a empty destory to avoid triggering unmatch when unregister
        destroy: () => { }
      });
    });
  }

  componentWillUnmount() {
    Object.keys(responsiveMap).map(screen => {
      return enquire.unregister(responsiveMap[screen]);
    });
  }

  getGutter = () => {
    const { screens } = this.state;
    const { gutter } = this.props;
    let breakpoint;

    if ((typeof gutter === 'undefined' ? 'undefined' : typeof gutter) === 'object')
      breakpoint = responsiveArray.find(bp => screens[bp] && gutter[bp] !== undefined);

    return breakpoint ? gutter[breakpoint] : gutter;
  }

  render() {
    const { type, justify, align, className, prefixCls = 'mobx-form-row',
      style, children, gutter: gutterProp, ...rest } = this.props;
    const gutter = this.getGutter();
    const classes = classnames({
      [prefixCls]: !type,
      [`${prefixCls}-${type}`]: type,
      [`${prefixCls}-${type}-${justify}`]: type && justify,
      [`${prefixCls}-${type}-${align}`]: type && align,
      [className]: true
    });
    const rowStyle = gutter > 0 ? {
      marginLeft: gutter / -2,
      marginRight: gutter / -2,
      ...style
    } : style;

    return (
      <div {...rest} className={classes} style={rowStyle}>
        {Children.map(children, col => {
          if ( !col ) return null;
          
          if (col.props && gutter > 0) {
            return cloneElement(col, {
              style: { 
                paddingLeft: gutter / 2, 
                paddingRight: gutter / 2, 
                ...col.props.style
              }
            });
          }
          return col;
        })}
      </div>
    );
  }
}