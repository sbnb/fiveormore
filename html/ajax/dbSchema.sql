DROP TABLE IF EXISTS messageTypes;

CREATE TABLE messageTypes (
    id INTEGER,
    messageType TEXT    
);

insert into messageTypes values(1, 'newGameButtonPressed');
insert into messageTypes values(2, 'gameFinished');
insert into messageTypes values(3, 'pageRefreshed');
insert into messageTypes values(4, 'viewHighScores');
insert into messageTypes values(5, 'highScoreEntered');
insert into messageTypes values(6, 'viewRules');
insert into messageTypes values(7, 'viewAbout');
insert into messageTypes values(8, 'playAgainPressed');
insert into messageTypes values(9, 'preferencesPressed');
insert into messageTypes values(10, 'boardSizeChange');

DROP TABLE IF EXISTS messages;

CREATE TABLE messages (
    uniqId TEXT,
    remoteAddress TEXT,
    messageTypeId INTEGER,
    stamp DATETIME
);

DROP TABLE IF EXISTS highscores;

CREATE TABLE highscores (
    uniqId TEXT,
    remoteAddress TEXT,
    username TEXT,
    score INTEGER,
    stamp DATETIME
);

insert into highscores values('abcdefghijklmno', 'localhost', 'Bob the Builder', 150, datetime('now'));
insert into highscores values('abcdefghijklmno', 'localhost', 'Ankle Biter', 250, datetime('now'));
insert into highscores values('abcdefghijklmno', 'localhost', 'Gabbo', 400, datetime('now'));
insert into highscores values('abcdefghijklmno', 'localhost', 'Sentimental Strudle', 150, datetime('now'));
insert into highscores values('abcdefghijklmno', 'localhost', 'John Irving', 10, datetime('now'));
insert into highscores values('abcdefghijklmno', 'localhost', 'The Snake', 50, datetime('now'));
insert into highscores values('abcdefghijklmno', 'localhost', 'Birdman', 5, datetime('now'));

--insert into messages values('abxdcee', 'unknown', 1, datetime('now'));
