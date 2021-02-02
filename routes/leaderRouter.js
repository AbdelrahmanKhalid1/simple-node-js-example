const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router();
leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({})
    .then((leaders) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders) //takes json string
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
})
.post((req, res, next) => {
    Leaders.create(req.body)
    .then((leaders) => {
        console.log('Promotion Created ', leaders);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) =>{
    Leaders.remove()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'applicatoin/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    //Dangerous operation not all users are allowed to do 
    //Will see by authontication hwo to handle it
});

leaderRouter.route('/:leaderId')
.get((req, res, next) =>{
    Leaders.findById(req.params.leaderId)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('Post operation not supported on /promotions/'
        + req.params.leaderId);
})
.put((req, res, next) =>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body //body sended to update
    }, {new: true}) //new means return the updated data
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) =>{
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;