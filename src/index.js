const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({exteded:false}))

app.use(require('./routes/routes.js'));


app.listen(3500);
console.log('serve on port 3500');