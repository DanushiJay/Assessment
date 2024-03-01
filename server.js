const express = require ('express');
const mongoose = require ('mongoose');
const morgan = require ('morgan');
const bodyParser = require ('body-parser');
const UserRoute = require('./routes/userRoute');

//Connecting Mongo DB
mongoose.connect('mongodb+srv://test123:test123@cluster0.hfbun7n.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
const userDB = mongoose.connection
userDB.on('error', (err) => {
    console.log(err)
})

userDB.once('open', () => {
    console.log('Successfully connected to the database')
})

const app = express ()
app.use (morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api', UserRoute)
app.use('/photoUploads', express.static('photoUploads'))

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
})
