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
  DatePicker,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List.less';
import { fetchDefaultPaginationItem, fetchQueryString, isNullOrUndefined } from '../../utils/utils';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ habit, loading }) => ({
  habit,
  loading: loading.models.habit,
}))
@Form.create()
export default class HabitList extends PureComponent { // 参考于TableList

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
    };
    console.log(" --- props: ", props);
  }


  componentDidMount() {

    const { dispatch, habit: { listData : { pagination : { current, pageSize}}} } = this.props;

    dispatch({
      type: 'habit/queryHabitList',
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
      type: 'habit/queryHabitList',
      payload: params,
    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'habit/queryHabitList',
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
          type: 'habit/deleteHabit',
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
        type: 'habit/queryHabitList',
        payload: {
          ...newFieldValues,
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
      type: 'habit/activeHabit',
      payload: videoId,
      callback: () => {
        const { habit } = this.props;
        const { current, pageSize } = habit.listData.pagination;
        dispatch({
          type: 'habit/queryHabitList',
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
            <FormItem label="习惯ID">
              {getFieldDecorator('id')(<Input placeholder="请输入习惯ID" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="习惯名">
              {getFieldDecorator('habitName')(<Input placeholder="请输入习惯名" />)}
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
            <FormItem label="习惯ID">
              {getFieldDecorator('id')(<Input placeholder="请输入习惯ID" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="习惯名">
              {getFieldDecorator('habitName')(<Input placeholder="请输入习惯名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="习惯类型">
              {getFieldDecorator('habitType')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="1">系统</Option>
                  <Option value="2">自定义</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="习惯标签">
              {getFieldDecorator('habitTag')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">&nbsp;</Option>
                  <Option value="0">其他</Option>
                  <Option value="1">健康</Option>
                  <Option value="2">学习</Option>
                  <Option value="3">日常</Option>
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
      habit: { listData },
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
        title: '习惯名称',
        dataIndex: 'habitName',
        key: 'habitName',
      },
      {
        title: '习惯标签',
        dataIndex: 'habitTagStr',
        key: 'habitTagStr',
      },
      {
        title: '习惯类型',
        dataIndex: 'habitTypeStr',
        key: 'habitTypeStr',
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
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
            <Link to={{ pathname: "/habit/habit-modify", query:{habitInfo: record }, search: `?habitId=${val}` }} hidden={record.habitType===2}>修改</Link>
            <Divider type="vertical" hidden={record.habitType===2} />
            <a onClick={(e) => this.handleActive(e, record.id)}>{record.active ? "冻结" : "激活"}</a>
          </Fragment>
        ),
      },
      /* <Link to="/habit/habit-list">查看视频</Link> */
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
