const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Entry = require('../models/Entries');
const {jsonAuth, auth} = require('./authController');

router.get('/', async (req,res) =>{
    try{
        const foundUsers = await User.find({})
                                     .execPopulate('entry')
                                     .select('-password')
        res.status(200).json(foundUsers)
                                     
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})

//add marks to existing users
router.post('/addEntryToUser',jsonAuth,(req,res)=>{
    console.log(res.locals);
    const entry = req.body
    const addEntQuery = User.findOneAndUpdate({username:res.locals.user},{$addToSet: {entries:entry._id}},{new:true})
    addEntQuery.exec((err,updatedUser)=>{
        if (err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            res.status(200).json({
                msg: `Updated ${res.locals.user} with ${entry.post}`
            })
        }
    })

})

router.post('/addEntry/:entry/:username', (req, res) =>{
    const entQuery = Entry.findOne({ title: req.params.entry })
    entQuery.exec(( err, entry ) => {
        if(err){
            res.status(400).json({
                msg: err.message
            })
        } else {
            const addEntQuery = User.findOneAndUpdate({ username: req.params.username }, { $addToSet: { entries: entry._id }}, {new: true})
            addEntQuery.exec((err, updatedUser) => {
                if(err){
                    res.status(400).json({
                        msg: err.message
                    }) 
                } else {
                    console.log(updatedUser);
                    res.status(200).json({
                        msg: `Updated ${updatedUser.username} with ${entry.post} `
                    })
                }
            })
        }
    })
})



// shows all marks for a specific user

router.get('/:username', auth, (req, res) => {
    console.log('something obnoxious');
    const userQuery = User.findOne({ username: req.params.username}).select('-password').populate('entries')
    
    userQuery.exec((err, foundUser) => {
        console.log(foundUser, err);
        if (err) {
           res.status(400).json({
               msg: err.message
           }) 
        } else {
            res.status(200).json(foundUser)
        }
    })

})
module.exports = router;