const { ipcMain } = require('electron');
const os = require('os');
const { BrowserWindow } = require('electron');
const { version } = require('../../package.json');
const aboutBruno = require('./about-bruno');

const template = [
  {
    label: '集合',
    submenu: [
      {
        label: '打开集合',
        click() {
          ipcMain.emit('main:open-collection');
        }
      },
      {
        label: '打开最近文件',
        role: 'recentdocuments',
        visible: os.platform() == 'darwin',
        submenu: [
          {
            label: '清除最近文件',
            role: 'clearrecentdocuments'
          }
        ]
      },
      {
        label: '偏好设置',
        accelerator: 'CommandOrControl+,',
        click() {
          ipcMain.emit('main:open-preferences');
        }
      },
      { type: 'separator' },
      { role: 'quit', label: '退出' },
      {
        label: '强制退出',
        click() {
          process.exit();
        }
      }
    ]
  },
  {
    label: '编辑',
    submenu: [
      { role: 'undo', label: '撤销' },
      { role: 'redo', label: '重做' },
      { type: 'separator' },
      { role: 'cut', label: '剪切' },
      { role: 'copy', label: '复制' },
      { role: 'paste', label: '粘贴' },
      { role: 'selectAll', label: '全选' },
      { type: 'separator' },
      { role: 'hide', label: '隐藏' },
      { role: 'hideOthers', label: '隐藏其他' }
    ]
  },
  {
    label: '视图',
    submenu: [
      { role: 'toggledevtools', label: '切换开发者工具' },
      { type: 'separator' },
      { role: 'resetzoom', label: '重置缩放' },
      { role: 'zoomin', label: '放大' },
      { role: 'zoomout', label: '缩小' },
      { type: 'separator' },
      { role: 'togglefullscreen', label: '切换全屏' }
    ]
  },
  {
    role: 'window',
    label: '窗口',
    submenu: [{ role: 'minimize', label: '最小化' }, { role: 'close', label: '关闭', accelerator: 'CommandOrControl+Shift+Q' }]
  },
  {
    role: 'help',
    label: '帮助',
    submenu: [
      {
        label: '关于Bruno',
        click: () => {
          const aboutWindow = new BrowserWindow({
            width: 350,
            height: 250,
            webPreferences: {
              nodeIntegration: true,
            },
          });
          aboutWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(aboutBruno({version}))}`);
        }
      },
      { label: '文档', click: () => ipcMain.emit('main:open-docs') }
    ]
  }
];

module.exports = template;  