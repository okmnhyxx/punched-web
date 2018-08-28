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
  Icon,
  Button,
  Dropdown,
  Menu,
  DatePicker,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from '../List.less';
import { fetchDefaultPaginationItem, fetchQueryString, isNullOrUndefined } from '../../utils/utils';

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ punch, loading }) => ({
  punch,
  loading: loading.models.punch,
}))
@Form.create()
export default class PunchList extends PureComponent { // 参考于TableList

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
    };
    console.log(" --- props: ", this.props);

    // this.handleActive = this.handleActive.bind(this);
  }


  componentDidMount() {

    const {
      dispatch,
      punch: { listData : { pagination : { current, pageSize}}},
    } = this.props;

    const memberId = fetchQueryString("memberId");

    dispatch({
      type: 'punch/queryPunchList',
      payload: {
        memberId,
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
      type: 'punch/queryPunchList',
      payload: params,
    });
  };


  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'punch/queryPunchList',
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
          type: 'punch/deletePunch',
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
      const { lastPunchTime  } = newFieldValues;

      delete newFieldValues.lastPunchTime;
      if (!isNullOrUndefined(lastPunchTime)) {
        newFieldValues.lastPunchTimeBegin = new Date(lastPunchTime[0]).toLocaleDateString().replace("/", "-").replace("/", "-");
        newFieldValues.lastPunchTimeEnd = new Date(lastPunchTime[1]).toLocaleDateString().replace("/", "-").replace("/", "-");
      }
      console.log(" --- newFieldValues: ", newFieldValues);

      dispatch({
        type: 'punch/queryPunchList',
        payload: {
          ...newFieldValues,
          ...fetchDefaultPaginationItem(),
        },
      });
    });
  };


  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户Id">
              {getFieldDecorator('memberId')(<Input placeholder="用户Id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="习惯Id">
              {getFieldDecorator('habitId')(<Input placeholder="习惯Id" />)}
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
    const InputGroup = Input.Group;
    const { RangePicker } = DatePicker;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="ID">
              {getFieldDecorator('id')(<Input placeholder="打卡Id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户Id">
              {getFieldDecorator('memberId')(<Input placeholder="用户Id" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="习惯Id">
              {getFieldDecorator('habitId')(<Input placeholder="习惯Id" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="累计打卡次数">
              <InputGroup compact>
                {getFieldDecorator('frequencyBegin')(<Input style={{ width: '40%', textAlign: 'center' }} placeholder="Minimum" />)}
                <Input style={{ width: '20%', textAlign: 'center', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                {getFieldDecorator('frequencyEnd')(<Input style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="最高连续次数">
              <InputGroup compact>
                {getFieldDecorator('maxPersistentBegin')(<Input style={{ width: '40%', textAlign: 'center' }} placeholder="Minimum" />)}
                <Input style={{ width: '20%', textAlign: 'center', borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                {getFieldDecorator('maxPersistentEnd')(<Input style={{ width: '40%', textAlign: 'center', borderLeft: 0 }} placeholder="Maximum" />)}
              </InputGroup>
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="最后打卡时间">
              {getFieldDecorator('lastPunchTime')(
                <RangePicker />
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
    console.log(" --- props:", this.props);
    const {
      punch: { listData },
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
        title: '习惯Id',
        dataIndex: 'habitId',
        key: 'habitId',
      },
      {
        title: '用户Id',
        dataIndex: 'memberId',
        key: 'memberId',
      },
      {
        title: '每周周期',
        dataIndex: 'markPunchDate',
        key: 'markPunchDate',
      },
      {
        title: '时间',
        dataIndex: 'punchClock',
        key: 'punchClock',
      },
      {
        title: '总累计',
        dataIndex: 'frequency',
        key: 'frequency',
        sorter: true,
      },
      {
        title: '当前',
        dataIndex: 'persistent',
        key: 'persistent',
      },
      {
        title: '最高',
        dataIndex: 'maxPersistent',
        key: 'maxPersistent',
        sorter: true,
      },
      {
        title: '宣言',
        dataIndex: 'manifesto',
        key: 'manifesto',
      },
      {
        title: '最后打卡',
        dataIndex: 'lastPunchTime',
        key: 'lastPunchTime',
        sorter: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: true,
        // render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      /* <Link to="/punch/punch-list">查看视频</Link> */
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
