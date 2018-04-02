/* Module includes*/
var express      = require('express');
var bodyParser   = require('body-parser');
var path         = require('path');
var url          = require('url');
var collection   = require('./mongo');
var passwordList = require('./password.json');
var app          = express();

/* Constants */
const PORT    = process.env.PORT || 3000;
const ROOT    = __dirname + '/public/';
const USER    = "user";
const COUNTER = "counter";

/* Middle Ware */
app.use(bodyParser());
app.use(express.static(ROOT));

/* Routes */

//  Check Database if given userId and 
//  password exists. Respond 200 if pass 
//  -word exists, 401 if none, 400 in err
app.post('/login', function(req, res) {
    var data = req.body;
    
    // Organize data according to
    // password type.
    collection(USER, (db)=>{
        db.findOne(data, (err, dbRes)=>{
            if(err) {
                res.sendStatus(400);
            }
            else if (dbRes === null) {
                res.sendStatus(401);
            }
            else {
                res.sendStatus(200);
            }
        });
    });
});

// generates userId and password, 
// inserts it to database and then 
// response back to client
app.get('/register', function(req, res) {
    var userData;

    // Passwords are selected randomly from password list 
    var password = capitalize(passwordList.password[randomIndex()]) + 
                   capitalize(passwordList.password[randomIndex()]) + 
                   capitalize(passwordList.password[randomIndex()]); 

    getNextId((id)=>{
        userData = new User(id, password);
        collection(USER, (db)=>{
            db.insert(userData, ()=>{
                res.send(JSON.stringify(userData));
            });
        });
    });
});

/* Functions */

/**
 * User Object
 *
 * @param number userId 
 * @param string password 
 */
function User(userId, password) {
    this.userId   = userId;
    this.password = password;
};

/**
 * Returns randomIndex
 * based on length of passwordlist
 *
 * @return number
 */
function randomIndex() {
    return Math.floor((Math.random() * (passwordList.password.length - 1)));
};

/**
 * Capitalizes first letter
 * in string
 *
 * @param string string
 * @return string
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Initializes counter in database
 * for generating auto-incremented userId
 *
 * @param function callback
 */
function initCounter(callback) {
    var counter = {_id: "userId", seq:0};

    collection(COUNTER, (db)=>{
        db.count((err, count)=>{
            if(! err && count === 0) {
                db.insert(counter);
            }
            callback();
        });
    });
};

/**
 * Gets next userId from db,
 * returns to callback
 *
 * @param function callback
 */
function getNextId(callback) {
    var query_1 = {_id: "userId"};
    var id;
    collection(COUNTER, (db)=>{
        db.findOne(query_1, (err, res)=>{
            id = res.seq;
            db.updateOne({_id: "userId"},{$inc: {seq: 1}}, (err, res)=>{
                callback(id);
            });
        });
    }); 
}

/**
 * Initializes counter, 
 * outputs running port
 */
function start() {
    initCounter(()=>{
        console.log('Server running on port: ' + PORT);
    });
};

/* Start server */
app.listen(PORT, start);
