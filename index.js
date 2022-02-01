const express = require('express');
const morgan = require('morgan')
const AppError = require('./AppError')

const app = express();

app.use(morgan('tiny'))
app.use((req, res, next) => {
    req.requestTime = Date.now();
    console.log(req.method, req.path);
    next();
})
const verifyPassword = (req, res, next) => {
    const { password } = req.query;
    if (password === 'chickennugget') {
        next();
    }
    res.send('SORRY YOU NEED A PASSWORD!!!')
}

// app.use((req, res, next) => {
//     console.log("First middleware")
//     console.log("First middleware")
//     return next();
// })
app.get('/', (req, res) => {
    console.log(req.requestTime)
    res.send('HOME PAGE!')
});
//Try catch database errors
app.put('/products/:id', wrapAsync(async (req, res, next) => {
    const { id }
    const product = await Product.findByIdAndUpdate(id, req.body)
    res.redirect(`/products/${product._id}`);

}))

function wrapAsync(fn) {
    return function (req, res, next) {
        fn(req, res, next).catch(e => next(e))
    }
}
//Async errors
app.get('/products/:id', wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id)
    if (!product) {
        throw new AppError('Product Not Found', 404);
    }
    res.render('products/show', { product })

}))

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: Sometimes I wear headphones in public so I dont have to talk to people')
})
app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF!')
});
app.get('/admin', (req, res) => {
    throw new AppError('You are not an Admin!', 403)
})
//Error 404
app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})

app.use((err, req, res, next) => {

    console.log('******************************************')
    console.log('****************ERROR*********************')
    console.log('******************************************')
    // res.status(500).send("OH BOY, WE GOT AN ERROR!!!")
    next(err)
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something Went Wrong' } = err;
    res.status(status).send(message)
})

const handleValidationErr = err => {
    console.log(err);
    return new AppError(`Validation Failed...${err.message}`, 400)
}
app.use((err, req, res, next) => {
    console.log(err.name);
    if (err.name = 'ValidationError') err = handleValidationErr(err)
    next(err);
})

app.listen(3000, () => {
    console.log('App is running on localhost:3000')
});
