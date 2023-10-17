const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5007;


//middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) =>{
    res.send('Gadget Junction  server is running')
});

app.listen(port, () =>{
    console.log(`Gadget Junction server is running on port:${port}`);
})