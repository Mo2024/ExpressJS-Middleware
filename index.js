const express = require('express');
const morgan = require('morgan')

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

app.get('/secret', verifyPassword, (req, res) => {
    res.send('MY SECRET IS: Sometimes I wear headphones in public so I dont have to talk to people')
})
app.get('/dogs', (req, res) => {
    res.send('WOOF WOOF!')
});

//Error 404
app.use((req, res) => {
    res.status(404).send('NOT FOUND!')
})

app.listen(3000, () => {
    console.log('App is running on localhost:3000')
});
