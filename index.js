// server.js
const express = require('express');
const app = express();
const { createClient } = require('redis')
app.use(express.json());
// Define a route for the root URL
 const client = createClient({
    socket: {
       port: 6379,
       host: 'redis-server'}})
client.connect();
client.on('connect', (err)=>{
    if(err) throw err;
    else console.log('Redis Connected..!');
});
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});
app.get('/hi',(req,res)=>{
    res.send('hi')
})
app.post('/setData', async (req, res) => {
    const data = req.body.data
    await client.set('data', data)
    res.send(`Set data ${data} sucessfully!`)
})
app.get('/getData', async (req, res) => {
    const data = await client.get('data')
    if (data) {
        res.send(`Found data ${data}`)
    } else {
        res.send('Data not found')
    }
})

app.get('/sayHello', async (req, res) => {
    var turn = await client.get('hello')
    if (turn) {
        await client.set('hello', parseInt(turn) + 1)
    } else {
        await client.set('hello', 1)
        turn = 0
    }

    res.send(`Met you ${turn} times!`)
})
// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
