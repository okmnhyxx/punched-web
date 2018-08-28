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

const FormItem = Form.Item;
const { TextArea } = Input;

// 参考于BasicForm

@connect(({ anchor, loading }) => ({
  anchor,
  submitting: loading.effects['anchor/submitAnchorForm'],
}))
@Form.create()
export default class AnchorModify extends PureComponent {

  constructor(props) {
    super(props);
    const { location} = this.props;
    const params = location.query;
    if (undefined !== params) {
      this.state = {
        anchorId: params.anchorId,
        anchorImage: params.anchorImage,
        anchorImageDefault: params.anchorImage,
        anchorSex : params.anchorSex,
        displayVal: 'none',
        // anchorSex : parseInt(params.anchorSex, 0),
      };
    } else {
      this.state = {
        anchorId: 0,
        anchorImage: '',
        anchorImageDefault: 'timg.jpeg',
        anchorSex : "0",
        displayVal: 'block',
      };
    }
    this.handleImgChange = this.handleImgChange.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { anchorId } = this.state;

    if (undefined !== anchorId && anchorId !== 0) {
      dispatch({
        type: 'anchor/queryAnchorInfo',
        payload: {
          'anchorId': anchorId,
        },
      });
    }

    console.log(" --- componentDidMount, state: ", this.state)
  }


  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { anchorId } = this.state;
    console.log(" --- handleSubmit, anchorId: ", anchorId);
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {

        dispatch({
          type: 'anchor/submitAnchorForm',
          payload: {values, anchorId},
        });
      }
    });
  };

  handleImgChange(e) {
    this.setState({
      anchorImage: e.target.value,
      anchorImageDefault: e.target.value,
    });
  }

  render() {
    const { submitting, form, anchor } = this.props;
    const { getFieldDecorator } = form;
    const { anchorImage, anchorImageDefault, anchorSex, displayVal } = this.state;

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

    const  {
      anchorInfo,
    } = anchor;
    let anchorInfoTmp = anchorInfo;
    if (undefined === anchorInfoTmp) {
      anchorInfoTmp = {};
    }

    return (

      <PageHeaderLayout
        title="基础表单"
        content="用户创建或修改界面。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="昵称">
              {getFieldDecorator('nickname', {
                initialValue: anchorInfoTmp.nickname,
                rules: [
                  {
                    required: true,
                    message: '请输入昵称',
                  },
                ],
              })(<Input placeholder="昵称信息" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="头像">
              {getFieldDecorator('portrait', {
                initialValue: anchorImage,
                rules: [
                  {
                    required: true,
                    message: '请输入头像',
                  },
                ],
              })(<Input placeholder="头像地址" setFieldsValue={anchorImage} onChange={(e)=>{this.handleImgChange(e)}} />)}
              <img src={anchorImageDefault} alt='头像' width='100' height='100' onError={(e)=>{e.target.src='timg.jpeg'}} />
            </FormItem>

            <FormItem {...formItemLayout} label="排序">
              {getFieldDecorator('turnsNum', {
                initialValue: anchorInfoTmp.turnsNum,
                rules: [
                  {
                    required: true,
                    message: '请输入排序',
                  },
                ],
              })(<Input type="number" placeholder="指定顺序" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="性别">
              {getFieldDecorator('sexType', {
                // initialValue: `${anchorInfoTmp.sexType}`,
                initialValue: anchorSex,
              })(
                <Radio.Group>
                  <Radio value="0">未知</Radio>
                  <Radio value="1">女</Radio>
                  <Radio value="2">男</Radio>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="区域">
              {getFieldDecorator('district', {
                initialValue: anchorInfoTmp.district,
                rules: [
                  {
                    required: true,
                    message: '请输入区域',
                  },
                ],
              })(<Input placeholder="省市区域" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="经济公司">
              {getFieldDecorator('company', {
                initialValue: anchorInfoTmp.company,
                rules: [
                  {
                    required: true,
                    message: '请输入经济公司',
                  },
                ],
              })(<Input placeholder="经济公司" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="签名">
              {getFieldDecorator('signature', {
                initialValue: anchorInfoTmp.signature,
                rules: [
                  {
                    required: true,
                    message: '请输入签名',
                  },
                ],
            })(<TextArea style={{ minHeight: 32 }} placeholder="个性签名～" rows={3} />)}
            </FormItem>


            <FormItem {...formItemLayout} label="默认视频" style={{ display: `${displayVal}`}}>
              {getFieldDecorator('videoName', {
                initialValue: anchorInfoTmp.district,
                rules: [
                  {
                    required: true,
                    message: '请输入视频名称',
                  },
                ],
              })(<Input placeholder="默认视频名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="默认视频地址" style={{ display: `${displayVal}`}}>
              {getFieldDecorator('videoUrl', {
                initialValue: anchorInfoTmp.district,
                rules: [
                  {
                    required: true,
                    message: '请输入视频地址',
                  },
                ],
              })(<Input placeholder="默认视频地址" />)}
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

  // initialValue: `"${anchorInfoTmp.sexType}"`,
  // initialValue: anchorInfoTmp.sexType === 2 ? "2" : "1",
  // initialValue: "1",
}


