import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Radio,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { fetchQueryString, isNullOrUndefined } from '../../utils/utils';

const FormItem = Form.Item;

// 参考于BasicForm

@connect(({ habit, loading }) => ({
  habit,
  submitting: loading.effects['habit/submitHabitForm'],
}))
@Form.create()
export default class HabitModify extends PureComponent {

  // constructor(props) {
    // super(props);
    // const { location : { query : {habitInfo}}} = this.props;
  // }

  componentDidMount() {

    const habitId = fetchQueryString("habitId");
    const { dispatch, location : { query }} = this.props;
    if (!isNullOrUndefined(habitId) && isNullOrUndefined(query)) {
      dispatch({
        type: 'habit/queryHabitInfo',
        payload: {
          habitId,
        },
      });
    }

  }


  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, history, habit : {habitInfo} } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        const habitId = isNullOrUndefined(habitInfo) ? 0 : habitInfo.id;
        console.log(" --- habitId:", habitId);
        dispatch({
          type: 'habit/submitHabitForm',
          payload: {
            values,
            habitId,
          },
          callback: ()=>{
            if (habitId !== 0) { // 创建的不跳转，修改的跳转
              history.push("/habit/habit-list");
            }
          },
        });
      }
    });
  };


  render() {
    const { submitting, form, habit : { habitInfo } } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const habitId = isNullOrUndefined(habitInfo) ? 0 : habitInfo.id;

    return (
      <PageHeaderLayout
        title="基础表单"
        content="系统习惯创建或修改界面。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="习惯名称">
              {getFieldDecorator('habitName', {
                initialValue: habitInfo.habitName,
                rules: [
                  {
                    required: true,
                    message: '请输入习惯名称',
                  },
                  {
                    whitespace: true,
                    message: '习惯名称不能仅为空格',
                  },
                  {
                    validator: (rule, value, callback) => {
                      const { dispatch } = this.props;
                      const resp = dispatch({
                        type: 'habit/checkHabitName',
                        payload: {
                          habitId,
                          habitName: value,
                        },
                      });
                      resp.then((val)=>{
                        const { success, errorMsg } = val;
                        if (success) {
                          callback();
                        } else {
                          callback(errorMsg);
                        }
                      });
                    },
                  },
                ],
              })(<Input placeholder="习惯名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="习惯标签">
              {getFieldDecorator('habitTag', {
                initialValue: `${habitInfo.habitTag}`,
                rules: [
                  {
                    pattern: "^\\d{1}$",
                    message: '习惯标签不能为空',
                  },
                ],
              })(
                <Radio.Group>
                  <Radio value="1">健康</Radio>
                  <Radio value="2">学习</Radio>
                  <Radio value="3">日常</Radio>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }

}


