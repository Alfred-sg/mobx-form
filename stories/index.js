import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Form from '../src';

storiesOf('mobx form', module)
  .add('form', () => (
    <Form/>
  ))