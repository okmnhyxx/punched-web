import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
// import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './VideoList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ video, loading }) => ({
  video,
  loading: loading.models.video,
}))
@Form.create()
export default class VideoList extends PureComponent { // 参考于TableList

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
    };
    console.log(" --- props: ", props);
    // this.handleActive = this.handleActive.bind(this);
    this.handleFormReset = this.handleFormReset.bind(this);
  }


  componentDidMount() {
    // const { dispatch, video } = this.props;
    // const { current, pageSize } = video.data.pagination;

    // const { dispatch, video:{data} } = this.props;
    // const { pagination: {current, pageSize} } = data;

    // const { dispatch, video:{data:{pagination}} } = this.props;
    // const { current, pageSize } = pagination;

    const { dispatch, video:{data:{pagination:{current, pageSize}}} } = this.props;

    dispatch({
      type: 'video/queryVideoList',
      payload: {
        currentPage: current,
        pageSize,
      },
    });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, form } = this.props;
    console.log(" --- handleStandardTableChange: ", pagination, filtersArg, sorter);

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...form.getFieldsValue(),
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'video/queryVideoList',
      payload: params,
    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'video/queryVideoList',
      payload: {},
    });
  };


  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };


  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'delete':
        dispatch({
          type: 'video/deleteVideo',
          payload: {
            ids: selectedRows.map(row => row.id).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      dispatch({
        type: 'video/queryVideoList',
        payload: fieldsValue,
        currentPage: 1,
        pageSize: 10,
      });
    });
  };


  handleActive = (e, videoId) => {
    const activeStr = e.target.innerText;
    console.log(" --- handleActive: ", activeStr);
    e.target.innerHTML = activeStr === "冻结" ? "激活" : "冻结";
    const { dispatch, form } = this.props;
    const fields = form.getFieldsValue();
    console.log(" --- fields: ", fields);

    dispatch({
      type: 'video/activeVideo',
      payload: videoId,
      callback: () => {
        const { video } = this.props;
        const { current, pageSize } = video.data.pagination;
        dispatch({
          type: 'video/queryVideoList',
          payload: {
            ...form.getFieldsValue(),
            pageSize,
            currentPage: current,
          },
        });
      },
    });
  };


  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="视频名">
              {getFieldDecorator('videoName')(<Input placeholder="请输入视频名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="主播名">
              {getFieldDecorator('anchorNickname')(<Input placeholder="请输入主播昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="请输视频ID" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="视频名">
              {getFieldDecorator('videoName')(<Input placeholder="请输入视频名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="主播名">
              {getFieldDecorator('anchorNickname')(<Input placeholder="请输入主播昵称" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="是否免费">
              {getFieldDecorator('freeCharge')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否默认">
              {getFieldDecorator('defaultVideo')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="1">是</Option>
                  <Option value="0">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('active')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="0">冻结</Option>
                  <Option value="1">正常</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      video: { data },
      loading,
    } = this.props;

    const { selectedRows } = this.state;

    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        sorter: true,
        align: 'right',
      },
      {
        title: '主播昵称',
        dataIndex: 'anchorNickName',
        key: 'anchorNickName',
      },
      {
        title: '视频名称',
        dataIndex: 'videoName',
        key: 'videoName',
      },
      {
        title: '视频地址',
        dataIndex: 'videoUrl',
        key: 'videoUrl',
      },
      {
        title: '点击量',
        dataIndex: 'clickNum',
        key: 'clickNum',
      },
      {
        title: '收费次数',
        dataIndex: 'chargeNum',
        key: 'chargeNum',
      },
      // {
      //   title: '总收费(币)',
      //   dataIndex: 'chargeAmounts',
      //   key: 'chargeAmounts',
      // },
      {
        title: '是否免费',
        dataIndex: 'freeCharge',
        key: 'freeCharge',
        render: val => (<span>{val ? "免费": "收费"}</span>),
      },
      {
        title: '是否默认',
        dataIndex: 'defaultVideo',
        key: 'defaultVideo',
        render: val => (<span>{val ? "是": "否"}</span>),
      },
      {
        title: '创建时间',
        dataIndex: 'createTimeStr',
        key: 'createTimeStr',
        sorter: true,
        // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        dataIndex: 'active',
        key: 'active',
        render: val => <span>{val ? "激活" : "冻结"}</span>,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id2',
        render: (val, record) => (
          <Fragment>
            <Link to={{ pathname: "/video/video-modify", query:{videoId: `${val}`} }}>修改</Link>
            <Divider type="vertical" />
            <a onClick={(e) => this.handleActive(e, record.id)}>{record.active ? "冻结" : "激活"}</a>
          </Fragment>
        ),
      },
            /* <Link to="/video/video-list">查看视频</Link> */
    ];


    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderLayout title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              rowKey='id'
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }

}
