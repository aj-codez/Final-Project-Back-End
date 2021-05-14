// Require modules
require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {hash, jsonAuth, auth} = require('./controllers/authcontroller');
const SECRET = process.env.SECRET_KEY;
// Create the Express app
const app = express();
const User = require('./models/User');
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use((req,res,next)=>{
    console.log(req.body)
    next()
})
app.use(cors());
mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser:true,
    useCreateIndex: true,
    useFindAndModify:true
} )

mongoose.connection.once('connected', () => console.log('Connected to Mongo Life is Good'));


app.use('/entries',require('./controllers/journalsController'))
app.use('/users',require('./controllers/usersController') )

// Configure the app (app.set)


// Mount middleware (app.use)


// Mount routes
app.get('/', function(req, res) {
  	res.send('<h1>Hello World!</h1>');
});
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = hash(password);
    User.findOne({ username },  (err, foundUser) => {
        if(err){
            res.status(400).json({ msg: err.message })
        } else {
            if(foundUser && bcrypt.compareSync(hashedPassword, foundUser.password)){
                const token = jwt.sign({
                    id: foundUser._id,
                    username: foundUser.username    
                }, SECRET)
                res.status(200).json({ token, username:foundUser.username })
            } else {
                res.status(500).json({
                    problem: 'The comparison did not work, did you change your hash algo'
                })
            }
        }
    })
})

app.post('/register',(req,res)=>{
    const passwordHash = hash(req.body.password);
    req.body.password = bcrypt.hashSync(passwordHash, bcrypt.genSaltSync(10))
    console.log(req.body)

    User.create(req.body, (err,createdUser)=>{
        if(err){
            console.log(err)
            res.status(400).json({
                msg: err.message
            })
        }else{
            const token = jwt.sign({
                id: createdUser._id,
                username: createdUser.username
            }, SECRET)
            res.status(200).json({
                token
            })
        }
    })
})

// Tell the app to listen on port 8080
app.listen(8080, function() {
 console.log('Listening on port 8080');
});