const express = require('express');
const router = express.Router();
const entry = require('../models/Entries');
// Index
router.get('/', async (req, res) => {
    let filters;
    if(Object.keys(req.query).length > 0){
        filters = {...req.query}
    }
    try {
        if(!filters){
            const foundEnts = await entry.find({});
            res.status(200).json(foundEnts)
        } else {
            const foundEnts = await entry.find({...filters});
            res.status(200).json(foundEnts)
        }  
    }catch(error){
        res.status(400).json({
            msg: error.message
        })
    }
})
// Create
router.post('/', async (req, res) => {
    try {
        const createdEnt = await entry.create(req.body)
        res.status(200).json(createdEnt)
    } catch(err){
        res.status(400).json({
            msg: err.message
        })
    }
})
// Show
router.get('/:id', async (req, res) => {
    try {
        const foundEnt = await entry.findById(req.params.id);
        res.status(200).json(foundEnt)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
router.get('/byPost/:post/', async (req, res) => {
    try {
        const foundEnt = await entry.findOne({ post: req.params.post });
        res.status(200).json(foundEnt)
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
// Update
router.put('/:id', async (req, res) => {
    try {
        const updatedEnt = await entry.findByIdAndUpdate(req.params.id, req.body, { new: true } )
        res.status(200).json(updatedEnt);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
// Delete
router.delete('/:id', async (req, res) => {
    try {
        const deletedEnt = await entry.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedEnt);
    } catch (error) {
        res.status(400).json({
            msg: error.message
        })
    }
})
module.exports = router