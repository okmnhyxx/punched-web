import { isUrl } from '../utils/utils';

const menuData = [
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
        hideInMenu: true,  // 隐藏该条
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
