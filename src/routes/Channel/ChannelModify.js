import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  Button,
  Card,
  Radio,
  notification,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { fetchQueryString, isNullOrUndefined } from '../../utils/utils';

const FormItem = Form.Item;
const { TextArea } = Input;

// 参考于BasicForm

@connect(({ channel, loading }) => ({
  channel,
  submitting: loading.effects['channel/submitChannelForm'],
}))
@Form.create()
export default class ChannelModify extends PureComponent {

  componentDidMount() {

    const channelId = fetchQueryString("channelId");
    const { dispatch, location : { query }} = this.props;
    if (!isNullOrUndefined(channelId) && isNullOrUndefined(query)) {
      dispatch({
        type: 'channel/queryChannelInfo',
        payload: {
          channelId,
        },
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const channelInfo = this.fetchChannelInfo();
    this.handleChannelInfoNull(channelInfo);

    const { form, dispatch, history } = this.props;
    const channelId = channelInfo.id;
    console.log(" --- handleSubmit, channelId: ", channelId);
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'channel/submitChannelForm',
          payload: {
            values,
            channelId,
          },
          callback: () => {
            history.push("/channel/channel-list");
          },
        });
      }
    });
  };

  handleChannelInfoNull(channelInfo) {
    // const channelInfo = this.fetchChannelInfo();
    if (isNullOrUndefined(channelInfo.id)) {
      const { history } = this.props;
      // notification['warn']({
      notification.warn({
        message: `渠道信息缺失`,
        description: '请从列表页点击修改,跳至刚才的页面',
        duration: 9,
      });
      history.push("/channel/channel-list");
    }
  }


  fetchChannelInfo() {
    const { location : { query } } = this.props;
    if (isNullOrUndefined(query)) {
      const { channel : { channelInfo }} = this.props;
      return channelInfo;
    } else {
      return query.channelInfo;
    }
  }

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

    const channelInfo = this.fetchChannelInfo();
    if (isNullOrUndefined(channelInfo)) {
      this.handleChannelInfoNull(channelInfo);
      return null;
    }

    return (

      <PageHeaderLayout
        title="基础表单"
        content="用户创建或修改界面。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="渠道名称">
              {getFieldDecorator('channelName', {
                initialValue: channelInfo.channelName,
                rules: [
                  {
                    required: true,
                    message: '请输入渠道名称',
                  },
                  {
                    validator: (rule, value, callback) => {
                      const { dispatch } = this.props;
                      const resp = dispatch({
                        type: 'channel/checkChannelName',
                        payload: {
                          channelName: value,
                          channelId: channelInfo.id,
                        },
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
              })(<Input placeholder="渠道名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="顶级渠道">
              {getFieldDecorator('topChannel', {
                initialValue: `${channelInfo.topChannel}`,
              })(
                <Radio.Group>
                  <Radio value="true">是</Radio>
                  <Radio value="false">否</Radio>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="上级渠道">
              {getFieldDecorator('parentId', {
                initialValue: channelInfo.parentId,
                rules: [
                  {
                    required: true,
                    message: '请输上级渠道',
                  },
                ],
              })(<Input placeholder="上级渠道" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="裂变渠道">
              {getFieldDecorator('childrenId', {
                initialValue: channelInfo.childrenId,
                rules: [
                  {
                    required: true,
                    message: '请输入裂变渠道',
                  },
                ],
              })(<Input placeholder="裂变渠道" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="粉丝总数">
              {getFieldDecorator('fans', {
                initialValue: channelInfo.fans,
              })(<Input placeholder="粉丝总数" disabled />)}
            </FormItem>

            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                initialValue: channelInfo.remark,
            })(<TextArea style={{ minHeight: 32 }} placeholder="备注" rows={3} />)}
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


