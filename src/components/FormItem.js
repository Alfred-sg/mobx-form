import React, { Component } from 'react';

export default class FormItem extends Component {
  render(){
    const { label, children } = this.props;
    const { props: { name } } = children;
    console.log(name)
    
    return (
      <div className='form-item'>
        {label}
        { children }
      </div>
    )
  }
};