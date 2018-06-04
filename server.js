const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// configured to run w/heroku or|| run port 3000 locally if it can't find heroku
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
//setting the view engine to hbs for express
app.set('view engine', 'hbs');

// middleware that logs server actions (keeps track of how the server is working)
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `${now}: ${req.method} ${req.url}`
    
    console.log(log);
    fs.appendFile('server.log', log + '/n', (err) => {
        if (err) {
            console.log('Unable to append to server.log.');
        }
    });
    next();
});

// maintenance middleware - comment out when not in use b/c it stops everything underneath it from rendering
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// });

// setting up static files (html, css, js, images); all static files can be served from this folder
app.use(express.static(__dirname + '/public'));

// hbs helper that returns the current year with the new date method
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

// hbs helper that returns the targeted title (ie welcomeMessage) as all uppercase
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

// routing for home page with request and response parameter
app.get('/', (req, res) => {
    // res.send('<h1>Hello Express!</h1>'); example
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: 'Welcome to my website',
    });
});

// routing for about page
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page',
    });
});

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects'
    });
});

// routing for error page
app.get('/bad', (req,res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

// listing on port (what/where ever the port is)
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});