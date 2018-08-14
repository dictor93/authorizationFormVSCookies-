<?php
  $reqParams = $_POST;
  $auth = $_COOKIE["authToken"];
  $users = file_get_contents("users.json");
  $usersData = json_decode($users);
  $userName = $reqParams["userName"];
  $userEmail = $reqParams["userEmail"];
  $userPWD = $reqParams["userPWD"];
  function searchByData($usersData, $userName, $userEmail, $userPWD){
    foreach ($usersData as $key => $user) {
      if(($user->eMail == $userEmail)&&($user->name == $userName)&&($user->password == $userPWD)){
        return $user->token;
      }
    }
    return(-1);
  }
  function searchByToken($usersData,$auth){
    foreach ($usersData as $key => $user) {
      if($user->token == $auth){
        return $user->name;
      }
      return(-1);
    }
  }
  if($_GET["logout"]){
    setcookie("authToken", null, -1, '/');
  }
  if(!$auth){
      $token = searchByData($usersData, $userName, $userEmail, $userPWD);
    if($token != -1){
      setcookie("authToken",$token);
      $auth=$token;
      echo "You signed in as <span style='color:red'>".$userName."</span>";
    }else{
      echo "<p style='color: red'>Invalid login or password</p>";
    }
  }else{
    $name = searchByToken($usersData, $auth);
    if($name){
      echo "You signed in as <span style='color:red'>".$name."</span>";
    }
  }

  
  
  

?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Form via cookies</title>
  </head>
  <body>
    <div class="container">
      <form class="needs-validation" novalidate method="post">
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


<?php
  if($auth){
    echo "<a class='log-out' href='?logout=true'> Log out </a>";
  }
?>
    


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