const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.get((req, res, next) => {
    Promotions.find({})
    .then((promotions) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions) //takes json string
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
})
.post((req, res, next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) =>{
    Promotions.remove()
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'applicatoin/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
    //Dangerous operation not all users are allowed to do 
    //Will see by authontication hwo to handle it
});

promoRouter.route('/:promotionId')
.get((req, res, next) =>{
    Promotions.findById(req.params.promotionId)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('Post operation not supported on /promotions/'
        + req.params.promotionId);
})
.put((req, res, next) =>{
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body //body sended to update
    }, {new: true}) //new means return the updated data
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) =>{
    Promotions.findByIdAndRemove(req.params.promotionId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = promoRouter;