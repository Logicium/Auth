var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var util = require('util');
var path = require('path');
var jwt = require('jsonwebtoken');
var jsonfile = require('jsonfile');
var fs = require('fs');
var im = require('imagemagick');
var jwtUtilities = require('express-jwt');

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/public",  express.static(__dirname + '/public'));

var Users = [];
var userFile = "__dirname + '/users/userData'";

app.get('/', function(request, response){
    response.sendFile("Auth.html", {"root": __dirname});
});

var apiRoutes = express.Router();

apiRoutes.post('/user/create', function(request, response) {
    var newUser = request.body;
    console.log("New user created:");
    console.log(newUser);
    Users.push(JSON.parse(JSON.stringify(newUser)));
    response.send("New user created successfully.");
});

apiRoutes.post('/user/login', function (request, response) {

    console.log("New user login request.");
    var incomingUser = request.body;
    console.log(incomingUser);

    for(var i = 0; i<Users.length;i++){
        var thisUser = Users[i];
        if((thisUser['email address']== incomingUser['email address']) &&
            (thisUser['password']==incomingUser['password'])){
            var token = jwt.sign(Users[i]['name'], 'superSecret', {
                expiresIn: 86400 // expires in 24 hours
            });
            // return the information including token as JSON
            response.json({
                success: true,
                message: 'Enjoy your token!',
                token: token
            });
            return;
        }
    }
    response.send("Authentication failed, credentials not found.");
});

apiRoutes.get('/user/logout',function(request, response){


});

apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, 'superSecret', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

// route to show a random message (GET http://localhost:8080/api/)
apiRoutes.get('/', function(request, response) {
    response.json({ message: 'You\'ve reached Auth\'s API homepage. :)' });
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/listUsers', function(request, response) {
    response.send(Users);
});

apiRoutes.post('/user/update',function(request,response){
    var updatedUser = request.body;
    Users[updatedUser['id']] = updatedUser;
    updateUserFile();
    response.send("User updated successfully.");
});

apiRoutes.post('/user/uploadImage',function(request,response){
    var User = request.body;
    var Image = request.files.image;
    var clientImageReadPath = Image.path;
    var clientImageName = Image.name;
    var hostImageWritePath = __dirname + "/user/"+User.name+""+User.id+"/images/" + clientImageName;
    fs.readFile(clientImageReadPath, function (err, data) {
        if(!clientImageName){
            response.json({message:"No name specified"});
        }
        else {
            // write file to uploads/fullsize folder
            fs.writeFile(hostImageWritePath, data, function (err) {
                // let's see it
                response.redirect("/user/images/" + clientImageName);
                //response.json({message:'Image uploaded to server successfully.'});
            });
        }
    });
});

apiRoutes.post('/user/retrive',function(request,response){
    var User = request.body['user'];
    response.json({user: Users[User.id]});
});

apiRoutes.post('/user/delete',function(request,response){
    var User = request.body;
    Users.remove(User['id']);
    updateUserFile();
    response.send({message: 'User deleted successfully.'});
});

//apiRoutes.post

function updateUserFile(){
    jsonfile.writeFile(userFile, Users, function (err) {
        if(!(err==null))console.error(err);
    });
}

// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);

var server = app.listen(8042, function(){
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port)
});

Array.prototype.remove = function(from, to) {
    var rest = this.slice(parseInt(to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};