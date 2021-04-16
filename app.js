const express = require('express')
const app = express()
var PORT = 3000;
 
app.get('*', (req, res) =>  res.send('ESTO ES EL BACKEND DE ECOPROTECT! \n'));
 
app.listen(PORT , '158.109.74.52');
console.log("Server on port ", PORT);