<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
    <title>Activity Report</title>
    <link rel="stylesheet" type="text/css" media="screen" href="resetdw.css">
</head>
<body>
    <div id="container">

    <h1>Activity Report</h1>

<?php
  error_reporting(E_ALL | E_STRICT);
  ini_set('display_errors', TRUE);

  $queryType = safeRetrieve($_GET, 'q', 'unknown');
  $ok = False;

  if ( "admin"  === $queryType ) {
    $ok = True;

  }
?>

    <h3>Last 24 Hours</h3>
    <ul>
        <?php echo getReportAsHtml(last24HoursSelect()) ?>
    </ul>

    <h3>Last 7 Days</h3>
    <ul>
        <?php echo getReportAsHtml(last7DaysSelect()) ?>
    </ul>

    <h3>Last 30 Days</h3>
    <ul>
        <?php echo getReportAsHtml(last30DaysSelect()) ?>
    </ul>

    <h3>Last 90 Days</h3>
    <ul>
        <?php echo getReportAsHtml(last90DaysSelect()) ?>
    </ul>

<?php
  function getReportAsHtml($select) {
    global $ok;

    if ( !$ok ) {
        return;
    }
    $dbh = getDbHandle();
    $sth = $dbh->query($select);
    $sth->setFetchMode(PDO::FETCH_OBJ);
    $buffer = "";
    while($row = $sth->fetch()) {
      $buffer .= '<li>' . $row->messageType . ' ' . intval($row->theCount) . '</li>';
    }
    return $buffer;
  }

  function last24HoursSelect() {
    return makeReportSelect('-24 hours');
  }

  function last7DaysSelect() {
    return makeReportSelect('-7 days');
  }

  function last30DaysSelect() {
    return makeReportSelect('-30 days');
  }

  function last90DaysSelect() {
    return makeReportSelect('-90 days');
  }

  function makeReportSelect($timePeriod) {
    $select =
      "select mt.messageType, count(m.messageTypeId) as theCount " .
      "from messages m " .
      "left join messageTypes mt " .
      "on m.messageTypeId = mt.id " .
      "where m.stamp > datetime('now', '" . $timePeriod. "') " .
      "group by mt.messageType " .
      "order by theCount DESC;";
    return $select;

  }

  function safeRetrieve($superGlobal, $key, $defaultValue) {
    if ( isset($superGlobal[$key]) ) {
      return htmlspecialchars($superGlobal[$key]);
    }
    return $defaultValue;
  }

  function getDbHandle() {
    $db = "sqlite:db/fiveormore.db";
    $dbh = new PDO($db);
    return $dbh;
  }

?>

    </div>
</body>
</html>

