var fs = require('fs');
var request = require('request');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var command = process.argv[2];
var nodeArgs = process.argv;
var client = new Twitter(keys.twitterKeys);
var spotify = new Spotify(keys.spotifyKeys);
var data = "";

function runCommand() {
    switch (command) {
        case 'my-tweets':
            myTwitter();
            break;

        case 'spotify-this-song':
            mySpotify();
            break;

        case 'movie-this':
            omdbAPI();
            break;

        case 'do-what-it-says':
            dowhatItSays();
            break;
    }
}

function omdbAPI(data) {

    var movieName = nodeArgs.splice(3).join("+");
    data = movieName;
    var apikey = "40e9cece";
    var queryURL = "http://www.omdbapi.com/?apikey=" + apikey + "&t=" + movieName;
    console.log(queryURL);

    if (!movieName) {
        console.log("If you haven't watched 'Mr. Nobody' then you should: " +
            "\nhttp://www.imdb.com/title/tt0485947" +
            " \nIt's on Netflix!");
        queryURL = "https://www.omdbapi.com/?t=mr+nobody&" + apikey;
    } else {

        request(queryURL, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                console.log(JSON.parse(body).Title);
                console.log(JSON.parse(body).Year);
                console.log(JSON.parse(body).imdbRating);
                console.log(JSON.parse(body).tomatorating);
                console.log(JSON.parse(body).Country);
                console.log(JSON.parse(body).Language);
                console.log(JSON.parse(body).Actors);
            } else {
                console.log(error);
            }
        })
    }
}

function myTwitter() {
    // this function will grab and show last 20 tweets as well
    // show the time/date they were created
    var params = { user_id: '954655232402731008', count: 20 };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log("Date:" + tweets[i].created_at);
                console.log("Tweets#" + (i + 1) + tweets[i].text);
            }
        } else {
            console.log(error);
        }
    });
};

function mySpotify(data) {
    songName = nodeArgs.splice(3).join(" ");

    if (!songName) {
        songName = "'The Sign' by Ace of Base";
    } else if (data != undefined) {
        songName = data
    }

    spotify.search({ type: 'track', query: songName }, function(error, data) {
        if (error) {
            console.log(error);
        } else {
            for (var i = 0; i < data.tracks.items[i].artists.length; i++) {
                console.log("Artist(s): " + data.tracks.items[i].album.artists[i].name);
                console.log("The song's name: " + data.tracks.items[i].name);
                console.log("Song preview: " + data.tracks.items[i].preview_url);
                console.log("Album: " + data.tracks.items[i].album.name);
            }
        }
    });
}


function dowhatItSays() {
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(",");
            nodeArgs = dataArr;
            command = dataArr[0];
            songName = dataArr.length;
            mySpotify(songName);
        }
    });
}
runCommand();