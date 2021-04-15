const express = require('express')
const app = express()
 
app.get('/', function (req, res) {
  res.send('ESTO ES EL BACKEND DE ECOPROTECT!')
})
 
app.listen(3000);