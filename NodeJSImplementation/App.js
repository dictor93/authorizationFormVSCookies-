const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const fs = require('fs');
const multer = require('multer');
const upload = multer();
const cookieParser = require('cookie-parser');
const port = 3001;
app.use(cookieParser()); 
app.use(jsonParser);
app.use(upload.array());
app.use(bodyParser.urlencoded({
    extended: true
}));
const headHTML = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Form via cookies</title>
  </head>
  <body>`;
var calculatedHead = '';
const mainHTML = `
    <div class="container">
      <form class="needs-validation" action="/auth" novalidate method="post">
        <div class="form-group">
          <label for="formEmail">Введите email</label>
          <input name="userEmail" type="email" class="form-control"  id="formEmail" placeholder="@mail" required>
          <label for="formEmail">Имя пользователя</label>
          <input name="userName" type="text" class="form-control"  id="formUserName" placeholder="Name" required>
          <label for="formPWD">Введите пароль</label>
          <input name="userPWD" type="password" class="form-control"  id="formPWD" placeholder="PWD" required>
          <input type="submit" class="btn btn-primary" value="Загрузить">
        </div>
      </form>
    </div>
`;
const endHTML = `
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script>
      (function() {
        'use strict';
        window.addEventListener('load', function() {
          var forms = document.getElementsByClassName('needs-validation');
          var validation = Array.prototype.filter.call(forms, function(form) {
            form.addEventListener('submit', function(event) {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();
    </script>
  </body>
</html>
`;
var calculatedHTML = '';

function checkAuthData(selector){
  let users = JSON.parse(fs.readFileSync("users.json"));
  if(selector.usrData){
    let userData = selector.usrData;
    let userName = userData.userName;
    let userEmail = userData.userEmail;
    let userPWD = userData.userPWD;
    for(let user in users){
      if((users[user].name==userName)&&(users[user].eMail==userEmail)&&(users[user].password==userPWD)){
        return users[user];
      }
    }
  }
  if(selector.token){
    
    //console.log(selector);
    for(let user in users){
      if((users[user].token == selector.token)){
        return users[user];
      }
    }
  }
  
  return -1;
}

app.post('/auth', upload.array(), function (request, response) {
    if(!request.body) return response.sendStatus(400);
    let user = checkAuthData({usrData:request.body});
    if( user != -1){
      response.cookie('token',user.token);
      calculatedHead = `You signed in as ${user.name}`;
      calculatedHTML = `<a style="color:red" href="/logout">Log out<a>`;
    }else{
      calculatedHTML = `<p style="color:red" >Invalid login or password<p>`;
    }
    
    
    response.end(headHTML + calculatedHead + mainHTML + calculatedHTML + endHTML);
    
});

app.get('',jsonParser,function(request,response){
  if(request.cookies.token){
    let user = checkAuthData({token:request.cookies.token});
    if(user != -1){
      calculatedHTML = `<a style="color:red" href="/logout">Log out<a>`;
      calculatedHead = `You signed in as ${user.name}`;
    }
  }
  

  //calculatedHTML = '';
  response.end(headHTML + calculatedHead + mainHTML + calculatedHTML + endHTML);
});

app.get('/logout',jsonParser,function(request,response){
    response.cookie('token', null, { expires: new Date(Date.now() - 1)});
    calculatedHead = '';
    calculatedHTML = '';
    response.end(headHTML + calculatedHead + mainHTML + calculatedHTML + endHTML);
});

app.listen(port);