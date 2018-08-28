import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { isNullOrUndefined } from '../../utils/utils';
import store from '../../index';

const FormItem = Form.Item;
const { TextArea } = Input;

// 参考于BasicForm

@connect(({ channel, loading }) => ({
  channel,
  submitting: loading.effects['channel/submitChannelForm'],
}))
@Form.create()
export default class ChannelCreate extends PureComponent {


  componentDidMount() {
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        dispatch({
          type: 'channel/createChannel',
          payload: { values },
        });
      }
    });
  };


  render() {
    const { submitting, form } = this.props;
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


    return (

      <PageHeaderLayout
        title="基础表单"
        content="新增渠道，会同时创建根渠道与裂变渠道，裂变渠道名字为：裂变-xxx"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="渠道名">
              {getFieldDecorator('channelName', {
                rules: [
                  {
                    required: true,
                    message: '请输入渠道名',
                  },
                  {
                    max: 20,
                    message: '渠道名最长20个字符',
                  },
                  {
                    whitespace: true,
                    message: '渠道名不能为空格',
                  },
                  {
                    validator: (rule, value, callback) => {
                      // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                      const { dispatch } = this.props;
                      const resp = dispatch({
                        type: 'channel/checkChannelName',
                        payload: { channelName: value },
                      });
                      resp.then((val)=>{
                        console.log(" --- Promise val: ", val);
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
              })(<Input placeholder="渠道名" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '请输入签名',
                  },
                  {
                    max: 200,
                    message: '备注最长200个字符',
                  },
                ],
            })(<TextArea style={{ minHeight: 32 }} placeholder="备注，200字内～" rows={3} />)}
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

  // initialValue: `"${channelInfoTmp.sexType}"`,
  // initialValue: channelInfoTmp.sexType === 2 ? "2" : "1",
  // initialValue: "1",
}


