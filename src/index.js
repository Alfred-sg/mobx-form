import React, { Component } from 'react';
import { render } from "react-dom";
import { Form, Input, Button } from 'antd';
import { registerFieldComponent, acquireFieldComponent } from './js/manager';
import form from 'apis/form';
import FormItem from 'components/FormItem';

// const FormItem = Form.Item;

registerFieldComponent({
  'Input': Input
});

const fields = [{
  type: 'Input', code: 'name', label: '字段名', placeholder: '请输入字段名', 
  rules: [{
    required: true, message: '请输入字段名'
  }]
},{
  type: 'Input', code: 'code', label: 'code', placeholder: '请输入code', 
  rules: [{
    required: true, message: '请输入code'
  }]
},{
  type: 'Input', code: 'test', label: 'test', placeholder: '请输入test', 
  rules: [{
    required: true, message: '请输入test'
  }], 
  when: (vals) => vals.code == '1234'
}]

@form
class Test extends Component {
  save = () => {
    const { field } = this.props;
    field.validate((errs, vals) => {
      console.log(vals)
    })
  }

  render(){
    const { field } = this.props;
    const { init, values } = field;

    console.log(values)

    return (
      <Form>
        {
          fields.map(field => {
            const { type, code, label, placeholder, rules, when } = field;
            const Comp = acquireFieldComponent(type);
            return !when || when(values) ? (
              <FormItem key={code} label={label}>
                <Comp placeholder={placeholder} {...init(code, {
                  rules
                })}/>
              </FormItem>
            ) : null
          })
        }

        <Button onClick={this.save}>保存</Button>
      </Form>
    )
  }
};

render(
  <Test/>,
  document.getElementById("root")
);
