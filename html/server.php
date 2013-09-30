<?php
  error_reporting(E_ALL | E_STRICT);
  ini_set('display_errors', TRUE);

  // process messages from the server
  // some messages are for gathering user usage patterns
  // also handles server high score saving

  $queryType = safeRetrieve($_POST, 'q', 'unknown');
  $uniqId = safeRetrieve($_POST, 'uniqId', 'unknown');
  $remoteAddress = safeRetrieve($_SERVER, 'REMOTE_ADDR', 'unknown');

  if ( "message" === $queryType ) {
    // do nothing, not storing messages anymore
    //~ $messageId = $_POST['messageId'];
    //~ storeMessageInDatabase($uniqId, $remoteAddress, $messageId);
  }

  if ( "sendHighScore" === $queryType ) {
    $username = $_POST['username'];
    $score = $_POST['score'];
    storeHighScore($uniqId, $remoteAddress, $username, $score);
  }

  if ( "getHighScores"  === $queryType ) {
    getHighScores();
  }

  function storeMessageInDatabase($uniqId, $remoteAddress, $messageId) {
    $dbh = getDbHandle();
    $stmt = $dbh->prepare("INSERT INTO MESSAGES (uniqId, remoteAddress, messageTypeId, stamp)" .
      " VALUES (:uniqId, :remoteAddress, :messageTypeId, datetime('now'))");
    $stmt->bindParam(':uniqId', $uniqId);
    $stmt->bindParam(':remoteAddress', $remoteAddress);
    $stmt->bindParam(':messageTypeId', $messageId);
    $stmt->execute();
  }

  // TODO: sanitise username (all fields) before insert
  // see: http://php.net/manual/en/pdo.prepared-statements.php
  function storeHighScore($uniqId, $remoteAddress, $username, $score) {
    $dbh = getDbHandle();
    $stmt = $dbh->prepare("INSERT INTO HIGHSCORES (uniqId, remoteAddress, username, score, stamp)" .
      " VALUES (:uniqId, :remoteAddress, :username, :score, datetime('now'))");
    $stmt->bindParam(':uniqId', $uniqId);
    $stmt->bindParam(':remoteAddress', $remoteAddress);
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':score', $score);
    $stmt->execute();
    showDbErrors($dbh);
  }

  function getHighScores() {
    $allTimeHighScores = getAllTimeHighScores();
    $recentHighScores = getRecentHighScores();
    $combinedServerHighscores = array("allTime" => $allTimeHighScores,
      "recent" => $recentHighScores);

    print(json_encode($combinedServerHighscores));
  }

  function getAllTimeHighScores() {
    $select =
      "SELECT username, score " .
      "FROM HIGHSCORES " .
      "ORDER BY score DESC, stamp ASC LIMIT 10;";
    return getHighScoresArrayFromQuery($select);
  }

  function getRecentHighScores() {
    $select =
      "SELECT username, score " .
      "FROM highscores " .
      "WHERE stamp > datetime('now', '-24 hours') " .
      "ORDER BY score DESC, stamp ASC LIMIT 10;";
    return getHighScoresArrayFromQuery($select);
  }

  function getHighScoresArrayFromQuery($select) {
    $highscores = array();
    $dbh = getDbHandle();
    $sth = $dbh->query($select);
    $sth->setFetchMode(PDO::FETCH_OBJ);
    while($row = $sth->fetch()) {
      array_push($highscores, array($row->username, intval($row->score)));
    }
    return $highscores;
  }

  function showDbErrors($dbh) {
    $errorInfo = $dbh->errorInfo();
    if ( $errorInfo[1] ) {
      error_log($errorInfo[2]);
    }
  }

  function getDbHandle() {
    $db = "sqlite:db/fiveormore.db";
    $dbh = new PDO($db);
    return $dbh;
  }

  function safeRetrieve($superGlobal, $key, $defaultValue) {
    if ( isset($superGlobal[$key]) ) {
      return htmlspecialchars($superGlobal[$key]);
    }
    return $defaultValue;
  }

?>
