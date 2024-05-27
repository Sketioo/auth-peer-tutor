const express = require('express');

const userRoute = require('./routes/user')


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoute)

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/', (req, res) => {
  res.status(404).send('Not Found');
})

app.listen(3001, () => {
  console.log('App listening on port 3000!');
  console.log(`Run the application in http://localhost:${process.env.PORT}`)
})