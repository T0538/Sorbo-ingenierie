// Test local pour vérifier CORS
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3002;

// CORS très permissif
app.use(cors({
    origin: '*',
    credentials: false,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['*']
}));

// Proxy vers Railway
app.use('/api', createProxyMiddleware({
    target: 'https://sorbo-api-production.up.railway.app',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api'
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🌐 Proxy: ${req.method} ${req.path} → Railway`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Proxy: ${req.path} → ${proxyRes.statusCode}`);
    }
}));

// Route de test
app.get('/', (req, res) => {
    res.json({
        message: 'Proxy CORS local pour Railway',
        endpoints: {
            health: '/api/health',
            logiciels: '/api/logiciels',
            formations: '/api/formations',
            actualites: '/api/actualites'
        },
        railway: 'https://sorbo-api-production.up.railway.app'
    });
});

app.listen(PORT, () => {
    console.log(`🧪 Proxy CORS local démarré sur le port ${PORT}`);
    console.log(`🌐 Test: http://localhost:${PORT}/api/health`);
    console.log(`📊 Logiciels: http://localhost:${PORT}/api/logiciels`);
});
