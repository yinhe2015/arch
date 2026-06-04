/*! arch. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
var cp = require('child_process')
var fs = require('fs')
var path = require('path')

/**
 * 获取操作系统真实的 CPU 架构
 * 完全不依赖 process.arch，只通过系统命令/文件判断
 * 支持：
 * macOS: arm64 / x86_64
 * Linux: arm64 / x86_64 / arm32 / x86_32
 * Windows: arm64 / x64 / x86
 * @returns {'x64' | 'x86' | 'arm' | 'arm64'}
 */
module.exports = function arch() {

  if (process.platform === 'darwin') { // Mac

    // 判断是否运行在 Rosetta 2 下
    try {
      const rosetta = cp.execSync('sysctl -in sysctl.proc_translated', { encoding: 'utf8' }).trim() === '1'
    } catch (err) {
      const rosetta = false // Fallback: 一般情况下都不在 Rosetta 2 下, 所以默认 false
    }

    try {
      // 获取 macOS 原生硬件架构
      const machine = cp.execSync('uname -m', { encoding: 'utf8' }).trim()
      if (rosetta) { // Rosetta 2 下反过来
        if (machine === 'arm64') return 'x64'
        if (machine === 'x86_64') return 'arm64'
      }
      else {
        if (machine === 'arm64') return 'arm64'
        if (machine === 'x86_64') return 'x64'
      }
    } catch (err) {}

    // Fallback
    // 现代大部分 Mac 都是 Apple Silicon 芯片, 旧的 x86_64 已经不生产, 仅有一些古老的 Mac 还在使用
    return 'arm64'
  }

  if (process.platform === 'linux') { // Linux
    try {
      // uname -m 是 Linux 最准确的架构判断方式
      const machine = cp.execSync('uname -m', { encoding: 'utf8' }).trim()

      if (machine === 'aarch64') return 'arm64'       // arm64
      if (machine.startsWith('arm')) return 'arm'     // arm32
      if (machine === 'x86_64') return 'x64'          // x86_64
      if (machine.startsWith('i')) return 'x86'       // x86_32 (i386/i686)
    } catch (err) {}

    // 降级方案: 通过位数判断
    try {
      const output = cp.execSync('getconf LONG_BIT', { encoding: 'utf8' }).trim()
      return output === '64' ? 'x64' : 'x86'
    } catch (err) {}

    return 'x64' // Fallback: x86_64
  }

  if (process.platform === 'win32') { // Windows
    const sysRoot = process.env.SYSTEMROOT || 'C:\\Windows' // Windows 目录

    try {
      // 判断是否为 arm64 架构
      fs.statSync(path.join(sysRoot, 'SysArm32'))
      return 'arm64'
    } catch (err) {}

    try {
      // 32 位程序运行在 64 位上会存在 SysNative
      fs.statSync(path.join(sysRoot, 'sysnative'))
      return 'x64'
    } catch (err) {}

    return 'x86' // 非 arm64 且非 64 位, 则 x86
  }

  return 'x64' // Fallback: x86_64
}