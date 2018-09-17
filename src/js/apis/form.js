import React, { Component } from 'react';
import { observer } from "mobx-react";
import Field from 'models/Field';

/**
 * form 装饰器，使被装饰的组件拥有响应式特征
 * @param {ReactClass} Comp  被装饰组件
 */
export default function form(Comp){
  const ObserveredComp = observer(Comp);
  const field = new Field();

  class WrappedComponent extends Component {
    static displayName = `WrappedForm-${Comp.name}`;

    render(){
      return <ObserveredComp {...this.props} field={field}/>
    }
  };

  return WrappedComponent;
};