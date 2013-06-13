<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
  <link href='http://fonts.googleapis.com/css?family=Shadows+Into+Light' rel='stylesheet' type='text/css'>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8">
  <title>Five or More Game</title>
  <meta name="description" content="Five or More is a fun and addictive puzzle game: align stones in lines of the same color to score points. Compete for your place in the high scores!">
  <link rel="stylesheet" type="text/css" media="screen" href="css/resetdw.css">
  <!--
  <link rel="stylesheet" type="text/css" media="screen" href="css/fiveormore.css">
  -->
  <link href="sass/stylesheets/screen.css" media="screen, projection" rel="stylesheet" type="text/css" />

  <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico">
  <script type="text/javascript" src="/lib/jq/jquery-1.7.1.min.js"></script>

  <!--combined_js_insert-->

  <!--[if lte IE 7]>
    <link rel="stylesheet" type="text/css" href="css/ie7-and-down.css">
  <![endif]-->

  <script type="text/javascript">
    var FOM = {env: {isIe: false}};
  </script>
  <!--[if ie]>
    <script type="text/javascript">
      FOM.env.isIe = true;
    </script>
  <![endif]-->

</head>

<body>
  <div id="container">

    <div class="menuWrap">
      <nav class="horizontal-nav full-width">
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/fiveormore/">Five or More</a></li>
          <li><a href="/scrammed/">Scrammed!</a></li>
        </ul>
      </nav>
    </div>

    <h1>Five or More</h1>

    <table id="fiveormore">
    <thead>
    <tr>
      <th colspan=5>
        <div id="nextText">Next:</div>
          <ul id="preview" class="plain">
            <li></li>
            <li></li>
            <li></li>
          </ul>
      </th>


      <th colspan=4>
        Score: <span id="score">0</span>
      </th>
    </tr>
    </thead>

    <tbody>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>
    <tr>
      <td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td>
    </tr>

    </tbody>
    </table>

    <div id="messages">
        <span></span>
    </div>

    <div id="buttonsWrap">
      <ul id="controlBar" class="plain">
        <li id="newGameButton" class="newGame">New Game</li>
        <li id="highScoresButton">High Scores</li>
        <li id="showRules" class="show">Rules</li>
        <li id="showPreferences" class="show">Preferences</li>
        <li id="showAbout" class="show">About</li>
      </ul>
    </div>

    <div id="gameOverPopup">
      <div class="closeWindowX"><span>X</span></div>
      <div id="gameOver">
        <h2>GAME OVER</h2>
        <p id="finalScore"><strong>Your score:</strong> <span></span></p>
      </div>

      <div id="enterHighScore">
        <h3>New High Score!</h3>
        <div id="inputBlock">
          <span id="name">Name: </span><input type="text" name="highScoreName" id="highScoreName">
          <span id="submitHighScore">OK</span>
        </div>
      </div>

<!-- BEGIN highScoresWrap -->
      <div id="highScoresWrap">
        <div id="allTimeScores" class="subScore">
          <h3><span>All Time Best</span></h3>
          <dl>
          </dl>
          <p class='toggleHighScores'><em class='recent'>Daily Best</em><em class='local'>Local Best</em></p>
        </div>

        <div id="recentScores" class="subScore">
          <h3><span>Daily Best</span></h3>
          <dl>
          </dl>
          <p class='toggleHighScores'><em class='allTime'>All Time Best</em><em class='local'>Local Best</em></p>
        </div>

        <div id="localScores" class="subScore">
          <h3><span>Local Best</span></h3>
          <dl>
          </dl>
          <p class='toggleHighScores'><em class='allTime'>All Time Best</em><em class='recent'>Daily Best</em></p>
        </div>

      </div>
<!-- END highScoresWrap -->

      <div id="playAgain" class="newGame"><span>Play again?</span></div>

      <p class="closeText"><span class="closeWindowText">Close this Window</span></p>

    </div>

    <div id="rules" class="popup">
      <div class="closeWindowX"><span>X</span></div>

      <h2>How to Play Five or More</h2>

      <p>Arrange the stones into lines of five or more to score points. Lines are
      contiguous runs of the same color stone; either vertical, horizontal or diagonal.
      Yes, <b>lines can be diagonal!</b></p>

      <p>To move a stone, click it to select then click an accessible square. A square is
      accessible if it is empty and there is a path of empty squares to reach it.</p>

      <p>Paths can only be in straight lines (vertical or horizontal, or a mixture). Diagonal
      moves are  not possible.</p>

      <p>When a line of five or more of the same color stones is made the stones will
      dissappear and points are awarded.</p>

      <h3>Scoring</h3>

      <p>Longer lines make more points per stone than shorter lines. However,
      keeping the board clear is crucial. This is easier if you clear stones
      as soon as possible. Feedback from the highest scorers suggests they do not
      attempt to get lines any longer than five, unless by chance.</p>

      <ul>
        <li><strong>5</strong> stones are worth <strong>10</strong> points</li>
        <li><strong>6</strong> stones are worth <strong>12</strong> points</li>
        <li><strong>7</strong> stones are worth <strong>18</strong> points</li>
        <li><strong>8</strong> stones are worth <strong>28</strong> points</li>
        <li><strong>9</strong> stones are worth <strong>42</strong> points</li>
      </ul>

      <p class="closeText"><span class="closeWindowText">Close this Window</span></p>
    </div>

    <div id="preferences" class="popup">
      <div class="closeWindowX"><span>X</span></div>

      <h2>Preferences</h2>

      <h5>Turn shapes on or off:</h5>
      <label><input type="radio" name="shapesOn" value="on" id="on">On</label><br>
      <label><input type="radio" name="shapesOn" value="off" id="off">Off</label><br>
      <p class="tip">* Useful if you have trouble distinguishing between two colors.</p>

      <h5>Change the board size to:</h5>

      <label><input type="radio" name="boardSize" value="small" id="small">Small</label><br>
      <label><input type="radio" name="boardSize" value="medium" id="medium">Medium</label><br>
      <label><input type="radio" name="boardSize" value="large" id="large">Large</label><br>
      <p class="tip">* Changing the board size will not affect the current game.</p>
      <p class="closeText"><span class="closeWindowText">Close this Window</span></p>
    </div>

    <div id="about" class="popup">
      <div class="closeWindowX"><span>X</span></div>

      <h2>About</h2>

      <p>Port of the Linux game "Five or More" by Robert Szokovacs and  Szabolcs Ban.
      That in turn was a port of "Color Lines", apparently available on early Windows machines.</p>

      <p>All code written by Sean Noble.</p>

      <p>I am available for hire, you can contact me at sean.noble.72@gmail.com</p>

      <p class="closeText"><span class="closeWindowText">Close this Window</span></p>

    </div>

    <div id="loading">
      <p><img src="imgs/loading.gif" /></p>
      <p>Please Wait</p>
    </div>

    <div id="pointsPopup">
      <p id="pointsText"></p>
    </div>

    <div id="endGame" style="border: 2px solid #AAA; width: 70px">
      <p>End Game</p>
    </div>

  </div>

<!--replace_start-->
  <script type="text/javascript" src="js/jquery.horizontalNav.js"></script>
  <script type="text/javascript" src="js/json2.js"></script>
  <script type="text/javascript" src="/lib/js/lodash.compat.min.js"></script>
  <script type="text/javascript" src="js/jquery.cookie.js"></script>
  <script type="text/javascript" src="/lib/js/pubsub.min.js"></script>

  <script type="text/javascript" src="js/const.js"></script>
  <script type="text/javascript" src="js/CookieHandler.js"></script>
  <script type="text/javascript" src="js/SettingsChanger.js"></script>
  <script type="text/javascript" src="js/PopupController.js"></script>
  <script type="text/javascript" src="js/ClickHandlers.js"></script>
  <script type="text/javascript" src="js/HighScoreList.js"></script>
  <script type="text/javascript" src="js/LocalHighScoreReader.js"></script>
  <script type="text/javascript" src="js/LocalHighScoreWriter.js"></script>
  <script type="text/javascript" src="js/ServerHighScoreReader.js"></script>
  <script type="text/javascript" src="js/ServerHighScoreWriter.js"></script>
  <script type="text/javascript" src="js/HighScoreGroup.js"></script>
  <script type="text/javascript" src="js/HighScoreAccessor.js"></script>
  <script type="text/javascript" src="js/MessageDisplayer.js"></script>
  <script type="text/javascript" src="js/PointsPopup.js"></script>
  <script type="text/javascript" src="js/LogicalBoard.js"></script>
  <script type="text/javascript" src="js/GameEventProducer.js"></script>
  <script type="text/javascript" src="js/GameEventConsumer.js"></script>
  <script type="text/javascript" src="js/Renderer.js"></script>
  <script type="text/javascript" src="js/RunFinder.js"></script>
  <script type="text/javascript" src="js/PathSearcher.js"></script>
  <script type="text/javascript" src="js/Score.js"></script>
  <script type="text/javascript" src="js/Colors.js"></script>
  <script type="text/javascript" src="js/PreviewStones.js"></script>
  <script type="text/javascript" src="js/GameBuilder.js"></script>
  <script type="text/javascript" src="js/Game2.js"></script>

<!--replace_end-->

  <script type="text/javascript">
    $(document).ready(function() {
      $('.full-width').horizontalNav({});
      $(FOM.constants.BOARD_SELECTOR + ' td.selected').removeClass('selected');
      FOM.game = new FOM.GameBuilder('#container').build(FOM.constants.BOARD_SELECTOR);
      FOM.game.start();
    });
  </script>

  <script type="text/javascript">
    var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-25173044-2']);
    _gaq.push(['_trackPageview']);
    (function() {
      var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
      ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
  </script>

</body>
</html>
