<?php 
  print('Testing SQLite on server.');
  error_reporting(E_ALL | E_STRICT);
  ini_set('display_errors', TRUE);
  
  echo "sqlite_libversion(): ", sqlite_libversion(), "<br>";
  echo "phpversion(): ", phpversion();
  
  foreach(PDO::getAvailableDrivers() as $driver) {
    echo $driver.'<br />';
  }
  
  $db = "sqlite:../protected/mytest.db";
  $drop = "DROP TABLE IF EXISTS mytable;";
  $create = "CREATE TABLE mytable (id INTEGER, animal TEXT);";
  $insert = "INSERT INTO mytable VALUES(1, 'all works if this is visible');";
  $sql = "SELECT * FROM mytable";
        
  try {
    /*** connect to SQLite database ***/
    $dbh = new PDO($db);
    $dbh->exec($drop);
    $dbh->exec($create);
    $dbh->exec($insert);
    foreach ($dbh->query($sql) as $row) {
      print $row['id'] .' - '. $row['animal'] . '<br />';
    }
    
  }
  catch(PDOException $e) {
    echo $e->getMessage();
  } 
?>