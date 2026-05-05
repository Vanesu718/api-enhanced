// middleware.js
export default function middleware(request) {
  const origin = request.headers.get('origin');
  const url = new URL(request.url);

  const allowedOrigins = [
    'http://127.0.0.1:3000',
    'http://localhost:3000',
    'https://vanesu718.github.io'
  ];

  const response = new Response(null, {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });

  // 动态设置允许的源
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  } else {
    response.headers.set('Access-Control-Allow-Origin', 'https://vanesu718.github.io');
  }

  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (request.method === 'OPTIONS') {
    return response;
  }

  // 继续正常请求（Vercel 会自动处理后续路由）
  return fetch(request);
}

export const config = {
  matcher: '/(.*)', // 匹配所有路径
};
