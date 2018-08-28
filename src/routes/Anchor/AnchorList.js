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

import styles from './AnchorList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => {

  console.log( " --- obj: ", obj, JSON.stringify(obj));
  const resp = Object.keys(obj)
    .map(key => obj[key])
    .join(',');
  console.log( " --- resp: ",resp);
  return resp;
};
// const statusMap = ['default', 'processing', 'success', 'error'];
// 参考于TableList

@connect(({ anchor, loading }) => ({
  anchor,
  loading: loading.models.anchor,
}))
@Form.create()
export default class AnchorList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      expandForm: false,
      selectedRows: [],
      formValues: {},
      pageSize : 10,
      currentPage: 1,
    };
    this.handleActive = this.handleActive.bind(this);
    this.handleFormReset = this.handleFormReset.bind(this);
    console.log(" --- props: ", props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { pageSize, currentPage } = this.state;
    dispatch({
      type: 'anchor/queryAnchorList',
      payload: {
        pageSize,
        currentPage,
      },
    });

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    console.log(" --- handleStandardTableChange: ", pagination, filtersArg, sorter, this.props);

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    this.setState({
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    });

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'anchor/queryAnchorList',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    // const { pageSize, currentPage } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'anchor/queryAnchorList',
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
          type: 'anchor/deleteAnchor',
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

  //
  // formatDate = (date,fmt) => {
  //   if(/(y+)/.test(fmt)){
  //     fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
  //   }
  //   let o = {
  //     'M+':date.getMonth() + 1,
  //     'd+':date.getDate(),
  //     'h+':date.getHours(),
  //     'm+':date.getMinutes(),
  //     's+':date.getSeconds()
  //   };
  //
  //   // 遍历这个对象
  //   for(let k in o){
  //     if(new RegExp(`(${k})`).test(fmt)){
  //       // console.log(`${k}`)
  //       console.log(RegExp.$1)
  //       let str = o[k] + '';
  //       fmt = fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
  //     }
  //   }
  //   return fmt;
  // };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { pageSize, currentPage } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const newFieldValues = { ...fieldsValue };
      const { beginTime  } = newFieldValues;
      if (undefined !== newFieldValues.beginTime) {
        newFieldValues.beginTime = new Date(beginTime).toLocaleDateString().replace("/", "-").replace("/", "-");
      }

      const values = {
        ...newFieldValues,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'anchor/queryAnchorList',
        payload: {
          ...values,
          pageSize,
          currentPage,
        },
      });
    });
  };


  handleActive = (e, anchorId) => {
    const activeStr = e.target.innerText;
    console.log(" --- handleActive: ", activeStr);
    e.target.innerHTML = activeStr === "冻结" ? "激活" : "冻结";
    const { dispatch } = this.props;
    const preTd = e.target.parentNode.previousSibling.firstElementChild;

    dispatch({
      type: 'anchor/activeAnchor',
      payload: anchorId,
      callback: () => {
        // const { pageSize, currentPage } = this.state;
        // dispatch({
        //   type: 'anchor/queryAnchorList',
        //   payload: {
        //     ...fields,
        //     pageSize,
        //     currentPage,
        //   },
        // });
        preTd.innerText = activeStr === "激活" ? "激活" : "冻结";
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
            <FormItem label="公司">
              {getFieldDecorator('company')(<Input placeholder="请输入公司" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="地区">
              {getFieldDecorator('district')(<Input placeholder="请输入地区" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label=">注册">
              {getFieldDecorator('beginTime')(
                <DatePicker style={{ width: '100%' }} placeholder="注册日期之后" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('active')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
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
      anchor: { data },
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
        title: '顺序',
        dataIndex: 'turnsNum',
        key: 'turnsNum',
        sorter: true,
      },
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
      },
      {
        title: '头像',
        dataIndex: 'portrait',
        key: 'portrait',
        render: val => <span> <img className='portraitImg' src={val} alt='头像' width='80' height='80' /> </span>,
      },
      {
        title: '性别',
        dataIndex: 'sexType',
        key: 'sexType',
        render: val => <span> {val === 1 ? "女" : (val === 2 ? "男" : "未知")} </span>,
      },
      {
        title: '视频数',
        dataIndex: 'videoNum',
        key: 'videoNum',
      },
      {
        title: '公司',
        dataIndex: 'company',
        key: 'company',
      },
      {
        title: '区域',
        dataIndex: 'district',
        key: 'district',
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
        key: '操作',
        /* <Link to={`/anchor/anchor-modify/${val}`}>修改</Link>  */
        render: (val, record) => (
          <Fragment>
            <Link to={{ pathname: "/anchor/anchor-modify", query:{anchorId: `${record.id}`, anchorImage: `${record.portrait}`, anchorSex: `${record.sexType}`} }}>修改</Link>
            <Divider type="vertical" />
            <a onClick={(e) => this.handleActive(e, record.id)}>{record.active ? "冻结" : "激活"}</a>
            <Divider type="vertical" />
            <Link to={{ pathname: "/video/video-list", query:{anchorId: `${record.id}`} }}>查看视频</Link>
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
