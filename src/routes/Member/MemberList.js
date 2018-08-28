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
  DatePicker,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List.less';
import { fetchDefaultPaginationItem, isNullOrUndefined } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => {
  console.log( " --- obj: ", obj);
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
};

// 参考于TableList
@connect(({ member, loading }) => ({
  member,
  loading: loading.models.member,
}))
@Form.create()
export default class MemberList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
    };
    console.log(" --- props: ", props);
    // this.handleFormReset = this.handleFormReset.bind(this);
  }

  componentDidMount() {
    const { dispatch, member: { listData : { pagination : { current, pageSize}}} } = this.props;

    dispatch({
      type: 'member/queryMemberList',
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
      type: 'member/queryMemberList',
      payload: params,
    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'member/queryMemberList',
      payload: {...fetchDefaultPaginationItem()},
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
          type: 'member/deleteMember',
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

      const newFieldValues = { ...fieldsValue };
      const { createTime  } = newFieldValues;

      delete newFieldValues.createTime;
      if (!isNullOrUndefined(createTime)) {
        newFieldValues.beginTime = new Date(createTime[0]).toLocaleDateString().replace("/", "-").replace("/", "-");
        newFieldValues.endTime = new Date(createTime[1]).toLocaleDateString().replace("/", "-").replace("/", "-");
        console.debug(" --- beginTime、endTime: ", newFieldValues.beginTime, newFieldValues.endTime);
      }
      console.log(" --- newFieldValues: ", newFieldValues);

      dispatch({
        type: 'member/queryMemberList',
        payload: {
          ...newFieldValues,
          ...fetchDefaultPaginationItem(),
        },
      });
    });
  };


  handleActive = (e, videoId) => {
  // handleActive(e, videoId) {
    const activeStr = e.target.innerText;
    console.log(" --- handleActive: ", activeStr);
    e.target.innerHTML = activeStr === "冻结" ? "激活" : "冻结";
    const { dispatch, form } = this.props;

    dispatch({
      type: 'member/activeMember',
      payload: videoId,
      callback: () => {
        const { member } = this.props;
        const { current, pageSize } = member.listData.pagination;
        dispatch({
          type: 'member/queryMemberList',
          payload: {
            ...form.getFieldsValue(),
            pageSize,
            currentPage: current,
          },
        });
        // const preTd = e.target.parentNode.previousSibling.firstElementChild;
        // preTd.innerText = activeStr === "激活" ? "激活" : "冻结";
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
            <FormItem label="id">
              {getFieldDecorator('id')(<Input placeholder="请输入ID" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入昵称" />)}
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
    const { RangePicker } = DatePicker;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickname')(<Input placeholder="请输入昵称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="渠道ID">
              {getFieldDecorator('channelId')(<Input placeholder="请输入渠道Id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="引入人Id">
              {getFieldDecorator('parentId')(<Input placeholder="请输入引入人" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="注册方式">
              {getFieldDecorator('registeredType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="0">未知</Option>
                  <Option value="1">二维码</Option>
                  <Option value="2">链接分享</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="注册">
              {getFieldDecorator('createTime')(
                <RangePicker />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('active')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="false">冻结</Option>
                  <Option value="true">正常</Option>
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
      member: { listData },
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
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        key: 'sex',
      },
      {
        title: '头像',
        dataIndex: 'portrait',
        key: 'portrait',
        render: val => <span> <img className='portraitImg' src={val} alt='头像' width='80' height='80' /> </span>,
      },
      {
        title: '渠道',
        dataIndex: 'channelName',
        key: 'channelName',
      },
      {
        title: '引入人Id',
        dataIndex: 'parentId',
        key: 'parentId',
      },
      {
        title: '注册方式',
        dataIndex: 'registeredType',
        key: 'registeredType',
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
        key: '操作',
        /* <Link to={`/member/member-modify/${val}`}>修改</Link>  */
        render: (val, record) => (
          <Fragment>
            <Link to={{ pathname: "/member/punch-list", query:{memberId: `${val}`}, search: `?memberId=${val}`}}>查看打卡</Link>
            <Divider type="vertical" />
            <a onClick={(e) => this.handleActive(e, record.id)}>{record.active ? "冻结" : "激活"}</a>
          </Fragment>
        ),
      },
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
