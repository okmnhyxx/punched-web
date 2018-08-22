import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    authority: ['admin','user'],
    children: [
      {
        name: '分析页',
        path: 'analysis',
        authority: ['admin','user'],
      },
      {
        name: '监控页',
        path: 'monitor',
        authority: ['admin','user'],
      },
      {
        name: '工作台',
        path: 'workplace',
        authority: ['admin','user'],
        // hideInBreadcrumb: true,
        // hideInMenu: true,
      },
    ],
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
    authority: ['admin','user'],
    children: [
      {
        name: '基础表单',
        path: 'basic-form',
        authority: ['admin','user'],
      },
      {
        name: '分步表单',
        path: 'step-form',
        authority: ['admin','user'],
      },
      {
        name: '高级表单',
        path: 'advanced-form',
        authority: ['admin','user'],
      },
    ],
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
    children: [
      {
        name: '查询表格',
        path: 'table-list',
      },
      {
        name: '标准列表',
        path: 'basic-list',
      },
      {
        name: '卡片列表',
        path: 'card-list',
      },
      {
        name: '搜索列表',
        path: 'search',
        children: [
          {
            name: '搜索列表（文章）',
            path: 'articles',
          },
          {
            name: '搜索列表（项目）',
            path: 'projects',
          },
          {
            name: '搜索列表（应用）',
            path: 'applications',
          },
        ],
      },
    ],
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
    authority: ['admin','user'],
    children: [
      {
        name: '基础详情页',
        path: 'basic',
        authority: ['admin','user'],
      },
      {
        name: '高级详情页',
        path: 'advanced',
        authority: 'admin',
      },
    ],
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
    authority: ['admin','user'],
    children: [
      {
        name: '成功',
        path: 'success',
        authority: ['admin','user'],
      },
      {
        name: '失败',
        path: 'fail',
        authority: ['admin','user'],
      },
    ],
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: '403',
        path: '403',
      },
      {
        name: '404',
        path: '404',
      },
      {
        name: '500',
        path: '500',
      },
      {
        name: '触发异常',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: '登录',
        path: 'login',
        authority: 'guest',
      },
      {
        name: '注册',
        path: 'register',
      },
      {
        name: '注册结果',
        path: 'register-result',
      },
    ],
  },
  {
    name: '用户模块',
    path: 'member',
    authority: ['admin','user'],
    children: [
      {
        name: '用户列表',
        path: 'member-list',
        authority: ['admin','user'],
      },
      {
        name: '打卡列表',
        path: 'punch-list',
        authority: ['admin','user'],
      },
    ],
  },
  {
    name: '习惯模块',
    path: 'habit',
    authority: ['admin','user'],
    children: [
      {
        name: '习惯列表',
        path: 'habit-list',
        authority: ['admin','user'],
      },
      {
        name: '新增习惯',
        path: 'habit-modify',
        authority: ['admin','user'],
      },
    ],
  },
  {
    name: '渠道模块',
    path: 'channel',
    authority: ['admin','user'],
    children: [
      {
        name: '渠道列表',
        path: 'channel-list',
        authority: ['admin','user'],
      },
      {
        name: '新增渠道',
        path: 'channel-create',
        authority: ['admin','user'],
      },
      {
        name: '修改渠道',
        path: 'channel-modify',
        authority: ['admin','user'],
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
