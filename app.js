const express = require('express');
const flash = require('connect-flash');
const session = require('express-session');

const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const _handlebars = require('handlebars');

const path = require('path');
const passport = require('passport');

const galleryRoutes = require('./routes/gallery');
const authRoutes = require('./routes/auth');


const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const PORT = process.env.PORT || 3000;

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(_handlebars)
});

require('./config/passport')(passport);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({secret:'werINGsegn1224AGnsk',
            resave: true,
            saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(authRoutes, galleryRoutes);

async function start()
{
    try
    {
        await mongoose.connect('mongodb+srv://Artyom:artem2000@cluster0.uh6hf.mongodb.net/gallery', 
        {
            useNewUrlParser: true,
            useFindAndModify: false
        });
        app.listen(PORT, () => 
        {
            console.log("Server has been started...");
        });
    }
    catch(e)
    {
        console.log(e);
    }
}

start();