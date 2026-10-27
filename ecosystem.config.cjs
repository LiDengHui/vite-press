const path = require('node:path');

module.exports = {
    apps: [
        {
            name: 'vite-press',
            cwd: __dirname,
            script: path.join(__dirname, 'node_modules/vitepress/bin/vitepress.js'),
            args: 'preview --port 8090',
            interpreter: 'node',
            exec_mode: 'fork',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '600M',
            kill_timeout: 5000,
            time: true,
            merge_logs: true,
            out_file: path.join(__dirname, '.pm2-logs/out.log'),
            error_file: path.join(__dirname, '.pm2-logs/error.log'),
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};
