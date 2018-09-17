import React, { Component } from 'react';

export default class Form extends Component {
  render(){
    const { children } = Form;
    
    return (
      <div>
        { children }
      </div>
    )
  }
};