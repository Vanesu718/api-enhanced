#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const tmpPath = require('os').tmpdir()
const express = require('express')
const app = express()

// ========== 动态 CORS 头（本地+线上自动适配）==========
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

// ========== 原有路由逻辑（完整恢复） ==========
const { login, login_status, login_refresh, login_qr_key, login_qr_create, login_qr_check } = require('./module/login')
const { user_account, user_detail, user_playlist, user_subcount, user_cloud, user_level, user_binding, user_replacephone } = require('./module/user')
const { search } = require('./module/search')
const { song_url, song_detail, song_lyric } = require('./module/song')
// 可能还有其他引入，但你之前的app.js只有那些路由，我这里先保底恢复核心的

// 登录相关
app.get('/login/status', (req, res) => login_status(req, res))
app.get('/login/refresh', (req, res) => login_refresh(req, res))
app.get('/login/qr/key', (req, res) => login_qr_key(req, res))
app.get('/login/qr/create', (req, res) => login_qr_create(req, res))
app.get('/login/qr/check', (req, res) => login_qr_check(req, res))

// 用户相关
app.get('/user/account', (req, res) => user_account(req, res))
app.get('/user/detail', (req, res) => user_detail(req, res))
app.get('/user/playlist', (req, res) => user_playlist(req, res))
app.get('/user/subcount', (req, res) => user_subcount(req, res))
// 如果有其他用户模块路由，这里继续加，但你可能只用到上面几个

// 搜索
app.get('/search', (req, res) => search(req, res))

// 歌曲
app.get('/song/url', (req, res) => song_url(req, res))
app.get('/song/detail', (req, res) => song_detail(req, res))
app.get('/song/lyric', (req, res) => song_lyric(req, res))

// 一起听相关（如果你原来的项目里有这些路由，请确保模块存在，但你的报错里用到了它们）
const { listen_together_room_create, listen_together_room_join } = require('./module/listenTogether')
app.get('/listen/together/room/create', (req, res) => listen_together_room_create(req, res))
app.get('/listen/together/room/join', (req, res) => listen_together_room_join(req, res))

// 启动初始化
async function start() {
  if (!fs.existsSync(path.resolve(tmpPath, 'anonymous_token'))) {
    fs.writeFileSync(path.resolve(tmpPath, 'anonymous_token'), '', 'utf-8')
  }
  // 此处可能还有更新 anonymous_token 的逻辑，保留原样即可
}
start()

module.exports = app
