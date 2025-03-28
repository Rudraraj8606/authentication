const express = require('express')
const App = express();
const port = 9000;
const movies = require('./movies')

App.use(express.json());
App.use(express.urlencoded({ extended: true }));

App.use('/api/movies', movies)

App.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`)
})