require("dotenv").config();

var fs = require("fs");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var inquirer = require("inquirer");
var dotEnv = require("dotenv");
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

inquirer.prompt([{
        type: "list",
        name: "doWhat",
        message: "Please select an option...",
        choices: ["my-tweets", "spotify-this-song", "movie-this"]
    },

    {
        type: "input",
        name: "songInput",
        message: "Which song would you like to search?",
        when: function (answers) {
            return answers.doWhat === "spotify-this-song";
        }
    },

    {
        type: "input",
        name: "movieInput",
        message: "Which movie would you like to search?",
        when: function (answers) {
            return answers.doWhat === "movie-this";
        }
    }

]).then(function (user) {
    switch (user.doWhat) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            searchSong(user.songInput);
            break;
        case "movie-this":
            getMovie(user.movieInput);
            break;
    }
})

function getTweets() {
    var params = {
        screen_name: "@MadrigalRichie",
        count: 20
    };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.reverse();
            for (var i = 0; i < tweets.length; i++) {
                console.log("\nCreated at: " + tweets[i].created_at);
                console.log("\nTweeted: " + tweets[i].text);

            }
        }
    });
}

function searchSong(song) {
    if (!song){
        song = ""
    }
    spotify.search({
        type: 'track',
        query: song,
        limit: 1
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("\nArtist: " + data.tracks.items[0].artists[0].name);
        console.log("\nSong name: " + data.tracks.items[0].name);
        console.log("\nPreview Link: " + data.tracks.items[0].preview_url);
        console.log("\nAlbum: " + data.tracks.items[0].album.name);
    });
}

function getMovie(movie) {
    var movieName = "";
    if (!movie){
        movieName = ""
    }else{
        movieName = movie
    };
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var title = JSON.parse(body).Title;
            var year = JSON.parse(body).Year;
            var lang = JSON.parse(body).Language;
            var country = JSON.parse(body).Country;
            var plot = JSON.parse(body).Plot;
            var actors = JSON.parse(body).Actors;
            var imdb = JSON.parse(body).Ratings[0].Value;
            console.log(`\nTitle: ${title}`);
            console.log(`\nYear: ${year}`);
            console.log(`\nIMDB Rating: ${imdb}`);
            console.log(`\nCounrty: ${country}`);
            console.log(`\nLanguage: ${lang}`);
            console.log(`\nPlot: ${plot}`);
            console.log(`\nActors: ${actors}`);
        }
    });
}
