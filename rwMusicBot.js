const Discord = require('discord.js');
const config = require('./auth.json');
const mysql = require("mysql");

const bot = new Discord.Client();

var db = mysql.createPool({
	host: config.sql.host,
	user: config.sql.user,
	password: config.sql.pass,
	database: config.sql.db
});

bot.on('ready', () => {
	console.log(time() + ' LHWB is ready!');
});

bot.on('message', message => {
	var command = message.content.split(" ");
	var params = command.slice(1, command.length).join(" ");

		switch(command[0].toLowerCase()) {
			case "!lversion":
				versionCommand(message);
				break;

			case "!lrestart":
				restartCommand(message);
				break;
                
            case "!tracks":
				trackCommand(message);
				break;
                
            case "!uh":
				huhCommand(message);
				break;
            
            case "!lrequest":
				requestCommand(message, params);
				break;
            
			case "!ljoin":
				join(message, params);
				break;

			case "!lleave":
				leave(message, params);
				break;
		}
});

function join(message, channelID) {
	//todo: accept channel name as param and catch err
	//currently only accepts channel id as parameter
	bot.channels.get(channelID).join();
	//test log
	console.log(time() + " LHWB joined " + channelID + " by " + message.author.tag + ".");
}

function leave(message, channelID) {
	//todo: require no parameter and catch err
	//currently only works if parameter is given
	bot.channels.get(channelID).leave();
	//test log
	console.log(time() + " LHWB left " + channelID + " by " + message.author.tag + ".");
}

function trackCommand(message) {
	message.reply("https://lhwb.tay.rocks/lhwb.php");
}

function huhCommand(message) {
	message.reply("huh");
}

function requestCommand(message, req) {
    var user = message.author.username;
    console.log(user + " - " + req);
    db.query("INSERT INTO requested (user, request) VALUES (?,?)", [user,req]);
	message.reply("Request submitted.");
}

function versionCommand(message) {
	message.channel.send("Running version: " + config.bot.version);
}

function restartCommand(message) {
    //todo: leave voice channel before restarting
    message.channel.send("LHWB restarting!").then(() => process.exit(-1));
}

function time() {
    var date = new Date();
    var time = date.toLocaleString();
    return time;
}

bot.login(config.bot.token);