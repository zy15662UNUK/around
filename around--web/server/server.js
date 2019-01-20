const express = require('express');
const app = express();
const router = require('./routers');
const bodyParser = require('body-parser');
const path = require('path');
app.use(bodyParser.json({limit: "50mb"}));

//config api router
app.use('/api', router);
//end config api router-----------------------------------------------------------------------------------------------------------

//config static directory
app.use(express.static(path.resolve('build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve('build/index.html'))
});
//end config static directory-----------------------------------------------------------------------------------------------------------

app.listen(9093, () => {
    console.log('server running at port 9093');
});