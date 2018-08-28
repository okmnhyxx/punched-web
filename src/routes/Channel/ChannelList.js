import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
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

import styles from '../List.less';
import { fetchDefaultPaginationItem } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ channel, loading }) => ({
  channel,
  loading: loading.models.channel,
}))
@Form.create()
export default class ChannelList extends PureComponent { // 参考于TableList

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
    // const { dispatch, channel } = this.props;
    // const { current, pageSize } = channel.listData.pagination;

    // const { dispatch, channel:{listData} } = this.props;
    // const { pagination: {current, pageSize} } = listData;

    // const { dispatch, channel:{listData:{pagination}} } = this.props;
    // const { current, pageSize } = pagination;

    const { dispatch, channel: { listData : { pagination : { current, pageSize}}} } = this.props;

    dispatch({
      type: 'channel/queryChannelList',
      payload: {
        currentPage: current,
        pageSize,
      },
    });
  }


  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch, form } = this.props;
    console.debug(" --- handleStandardTableChange: ", pagination, filtersArg, sorter);

    // filters 一直为空
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
      type: 'channel/queryChannelList',
      payload: params,
    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'channel/queryChannelList',
      payload: {
        ...fetchDefaultPaginationItem(),
      },
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
          type: 'channel/deleteChannel',
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
        type: 'channel/queryChannelList',
        payload: {
          ...fieldsValue,
          ...fetchDefaultPaginationItem(),
        },
      });
    });
  };


  handleActive = (e, videoId) => {
    const activeStr = e.target.innerText;
    console.log(" --- handleActive: ", activeStr);
    e.target.innerHTML = activeStr === "冻结" ? "激活" : "冻结";
    const { dispatch, form } = this.props;
    // const fields = form.getFieldsValue();
    // console.log(" --- fields: ", fields);

    dispatch({
      type: 'channel/activeChannel',
      payload: videoId,
      callback: () => {
        const { channel } = this.props;
        const { current, pageSize } = channel.listData.pagination;
        dispatch({
          type: 'channel/queryChannelList',
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
            <FormItem label="渠道ID">
              {getFieldDecorator('ids')(<Input placeholder="多个渠道请用,隔开" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="渠道名">
              {getFieldDecorator('channelName')(<Input placeholder="请输入渠道名" />)}
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
            <FormItem label="渠道ID">
              {getFieldDecorator('ids')(<Input placeholder="多个渠道请用,隔开" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="渠道名">
              {getFieldDecorator('channelName')(<Input placeholder="请输入渠道名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否根渠道">
              {getFieldDecorator('topChannel')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="true">是</Option>
                  <Option value="false">否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('active')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="true">正常</Option>
                  <Option value="false">冻结</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            &nbsp;
          </Col>
          <Col md={8} sm={24}>
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
          </Col>
        </Row>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      channel: { listData },
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
        title: '渠道名',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '上级',
        dataIndex: 'parentId',
        key: 'parentId',
      },
      {
        title: '下级',
        dataIndex: 'childrenId',
        key: 'childrenId',
      },
      {
        title: '二维码粉',
        dataIndex: 'qrCodeFans',
        key: 'qrCodeFans',
      },
      {
        title: '链接粉',
        dataIndex: 'linkFans',
        key: 'linkFans',
      },
      {
        title: '总粉丝数',
        dataIndex: 'fans',
        key: 'fans',
        sorter: true,
      },
      {
        title: '根渠道',
        dataIndex: 'topChannel',
        key: 'topChannel',
        render: val => (<span>{val ? "是": "否"}</span>),
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
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
        key: 'idOperate',
        render: (val, record) => (
          <Fragment>
            <Link to={{ pathname: "/channel/channel-modify", query:{channelId: `${val}`, channelInfo: record }, search: `?channelId=${val}` }}>修改</Link>
            <Divider type="vertical" />
            <a onClick={(e) => this.handleActive(e, record.id)}>{record.active ? "冻结" : "激活"}</a>
          </Fragment>
        ),
      },
      /* <Link to="/channel/channel-list">查看视频</Link> */
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
              data={listData}
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
