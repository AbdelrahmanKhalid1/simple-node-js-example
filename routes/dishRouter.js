const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

dishRouter.route('/')
.get((req, res, next) => {
    Dishes.find({})
    .then((dishes) =>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes) //takes json string
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
})
.post((req, res, next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) =>{
    Dishes.remove()
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
    //Dangerous operation not all users are allowed to do 
    //Will see by authontication hwo to handle it
});

dishRouter.route('/:dishId')
.get((req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('Post operation not supported on /dishes/'
        + req.params.dishId);
})
.put((req, res, next) =>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body //body sended to update
    }, {new: true}) //new means return the updated data
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) =>{
    Dishes.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err));
        }
        else
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'
        + req.params.dishId + '/comments');
})
.delete((req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if(dish != null){
            for (var i =(dish.comments.lenght -1); i>=0 ; i--){
                dish.comments.id(dish.comments[i].id).remove(); //accesssing sub document which is comments on a the dish
            }
            dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err));
        }
        else
        {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
    //Dangerous operation not all users are allowed to do 
    //Will see by authontication hwo to handle it
});

dishRouter.route('/:dishId/comments/:commentId')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null  && dish.comments.id(req.param.commentId) != null){ 
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.param.commentId));
        }
        else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else { //comment not exist
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/' + req.params.dish 
        + ' /comments/' + req.params.commentId);

})
.put((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null  && dish.comments.id(req.param.commentId) != null){ 
            //comment author should not be changed so we'll handle changed field only
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment;
            }
            //the only way founded to update sub document in document in mongoose
            dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.param.commentId));
                }, (err) => next(err));
        }
        else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else { //comment not exist
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
})
.delete((req, res, next) =>{
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null  && dish.comments.id(req.param.commentId) != null){ 
            dish.comments.id(req.params.commentId).remove();
            dish.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish)
                }, (err) => next(err));
        }
        else if(dish == null){
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else { //comment not exist
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err)); //will send the error to an overall error handler
    //Dangerous operation not all users are allowed to do 
    //Will see by authontication hwo to handle it
});

module.exports = dishRouter;