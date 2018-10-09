import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Form from '../build/js/Form';

console.log(111)
console.log(Form)

storiesOf('mobx form', module)
  .add('form', () => (
    <Form/>
  ))