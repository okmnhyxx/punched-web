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
import { isNullOrUndefined } from '../../utils/utils';

const FormItem = Form.Item;
// 参考于BasicForm

@connect(({ video, loading }) => ({
  video,
  submitting: loading.effects['video/submitVideoForm'],
}))
@Form.create()
export default class VideoModify extends PureComponent {

  // constructor(props) {
  //   super(props);
    // const { location:params} = this.props;
    // const params = location.query;
    // if (undefined !== params) {
    //   this.state = {
    //     videoId: params.videoId,
    //   };
    // } else {
    //   this.state = {
    //     videoId: 0,
    //   };
    // }
  // }

  componentDidMount() {
    const { dispatch } = this.props;
    const videoId = this.fetchVideoId();

    if (undefined !== videoId && videoId !== 0) {
      dispatch({
        type: 'video/queryVideoInfo',
        payload: {
          'videoId': videoId,
        },
      });
    }

    console.log(" --- componentDidMount, state: ", this.state);
  }

  handleSubmit = e => {
    e.preventDefault();

    const { form, dispatch, history } = this.props;
    let videoId = this.fetchVideoId();
    console.log(" --- handleSubmit, videoId: ", videoId);
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (isNullOrUndefined(videoId)) {
          videoId = 0;
        }
        dispatch({
          type: 'video/submitVideoForm',
          payload: {
            ...values,
            videoId,
          },
          callback: () => {
            history.push("/video/video-list");
          },
        });
      }
    });
  };

  fetchVideoId() {
    const { location: { query} } = this.props;
    console.log(" --- fetchVideoId: ", query);
    if (isNullOrUndefined(query)) {
      return 0;
    } else {
      return parseInt(query.videoId, 0);
    }
  }

  render() {
    const { submitting, form, video } = this.props;
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

    const  { videoInfo } = video;
    let videoInfoTmp = videoInfo;
    if (undefined === videoInfoTmp) {
      videoInfoTmp = {
        anchorId:1,
        videoName: "aaa",
        videoUrl: "bbb",
      };
    }

    return (
      <PageHeaderLayout
        title="基础表单"
        content="用户创建或修改界面。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label=" 主播ID">
              {getFieldDecorator('anchorId', {
                initialValue: videoInfoTmp.anchorId,
                rules: [
                  {
                    required: true,
                    message: '请输入主播ID',
                  },
                ],
              })(<Input placeholder="主播ID" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="视频名称">
              {getFieldDecorator('name', {
                initialValue: videoInfoTmp.videoName,
                rules: [
                  {
                    required: true,
                    message: '请输入视频名称',
                  },
                ],
              })(<Input placeholder="视频名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="视频地址">
              {getFieldDecorator('url', {
                initialValue: videoInfoTmp.videoUrl,
                rules: [
                  {
                    required: true,
                    message: '请输入视频地址',
                  },
                ],
              })(<Input placeholder="视频地址" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="是否免费">
              {getFieldDecorator('freeCharge', {
                initialValue: `${isNullOrUndefined(videoInfoTmp.chargeNum) || videoInfoTmp.chargeNum === 0}`,
              })(
                <Radio.Group>
                  <Radio value="true">免费</Radio>
                  <Radio value="false">收费</Radio>
                </Radio.Group>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="是否默认">
              {getFieldDecorator('defaultVideo', {
                initialValue: parseInt(`${isNullOrUndefined(videoInfoTmp.defaultVideo) || !videoInfoTmp.defaultVideo ? 0 : 1}`, 0),
              })(
                <Radio.Group>
                  <Radio value={0}>否</Radio>
                  <Radio value={1}>是</Radio>
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


