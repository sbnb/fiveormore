<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
  <title>PHP Version Info</title>
</head>
<body>
  <div id="container">
  <h2>PHP Settings</h2>
  
  <?php
    error_reporting(E_ALL | E_STRICT);
    ini_set('display_errors', TRUE);
    
    echo "sqlite_libversion(): ", sqlite_libversion(), "<br>";
    echo "phpversion(): ", phpversion();
    phpinfo();
  ?>    
  </div>
</body>
</html>
