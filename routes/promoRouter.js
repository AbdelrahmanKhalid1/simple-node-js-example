const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();
promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req, res, next) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text-plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the promotions to you!');
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + 
    ' with details ' + req.body.description);

})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) =>{
    res.end('Deleting all the promotions!');
    //Dangerous operation not all users are allowed to do 
    //Will see by authontication hwo to handle it
});

promoRouter.route('/:id')
.get((req, res, next) =>{
    res.end('Will send details of the promotion: '
     + req.params.id + ' to you!');
})
.post((req, res, next) =>{
    res.statusCode = 403;
    res.end('Post operation not supported on /promotions/'
        + req.params.id);
})
.put((req, res, next) =>{
    res.write('Updating the promotion: ' + req.params.id + '\n');
    res.end('Will update the promotion: ' + req.body.name 
        + ' with details: ' + req.body.description);
})
.delete((req, res, next) =>{
    res.end('Deleting promotion: ' + req.params.id);
});

module.exports = promoRouter;