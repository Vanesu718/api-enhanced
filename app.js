#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()

// 先初始化必要文件
async function start() {
  // 检测是否存在 anonymous_token 文件,没有则生成
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 启动时更新 anonymous_token 的函数调用（保持原逻辑不变）
}

// 创建 Express 应用
const express = require('express')
const app = express()

// ========== 动态 CORS 头（本地 + 线上自动适配）==========
const allowedOrigins = [
  'http://127.0.0.1:3000',
  'http://localhost:3000',
  'https://vanesu718.github.io'
]

app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  } else {
    res.header('Access-Control-Allow-Origin', 'https://vanesu718.github.io')
  }
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  next()
})
// ====================================================

// 下面是你原来的所有路由和其他中间件（必须紧跟在 CORS 后面）
// 例如：
// app.get('/login/qr/key', ...)
// ... 把你现有的所有 app.use / app.get 等全部保留在这后面 ...

// 最后的启动逻辑也保留
start()
module.exports = app
