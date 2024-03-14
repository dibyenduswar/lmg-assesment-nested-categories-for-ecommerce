const app = require('./src/index');    
const http = require('http');
require('dotenv').config({ path: `.env` });
const server = http.createServer(app);
const port = process.env.APP_PORT;
server.listen(port, () => {
    console.log(`service is running on port ${port} (PID: ${process.pid})`)
});  

module.exports = server;