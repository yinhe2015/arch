# arch

### 一款比 Node.js 内置 os.arch() 更优秀的跨平台架构检测库，不兼容浏览器环境 —— 用于精准识别操作系统 CPU 架构，并修复若干系统识别问题。

In Node.js, the `os.arch()` method (and `process.arch` property) returns a string
identifying the operating system CPU architecture **for which the Node.js binary
was compiled**.

This is not the same as the **operating system CPU architecture**. For example,
you can run Node.js 32-bit on a 64-bit OS. In that situation, `os.arch()` will
return a misleading 'x86' (32-bit) value, instead of 'x64' (64-bit).

Use this package to get the actual operating system CPU architecture.

## 安装

```
git clone https://github.com/yinhe2015/arch.git
cd arch
npm install .
```

## 用法

```js
var arch = require('arch')
console.log(arch()) // 返回 'x64' | 'x86' | 'arm' | 'arm64'
```

## 许可证

本项目基于 MIT 协议开源.
原作版权: [Feross Aboukhadijeh](http://feross.org)
修改部分版权: yinhe2015
