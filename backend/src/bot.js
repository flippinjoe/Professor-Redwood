'use strict';

const Discord = require('discord.js');
// const mySQL = require('mysql');

const chatCommandsFunc = require('./lib/chatrouter');
const CONSTANTS = require('./lib/constants');
const config = require('./config/secrets.json');

const client = new Discord.Client();
const token = config.discord.token;
/*
const db = mySQL.createConnection(config.mysql);
// let's not connect to the database for now
db.connect((err) => {
	if (err) throw err;
	console.log('Database Connected!');
}); */

const rolesByName = {};
const emojisByName = {};
const channelsByName = {};
var CHATCOMMANDS;
var GUILD;

// ** Helper functions: **
const getEmoji = (pokemon) => {
	var emoji = pokemon;
	if (pokemon === 'ho-oh') {
		emoji = 'hooh'; // special case for ho-oh
	}
	if (emojisByName[emoji] !== null && emojisByName[emoji] !== undefined)
		return '<:' + emoji + ':' + emojisByName[emoji].id + '>';
	return '';
};

client.on('ready', () => {
	client.guilds.forEach((guild) => {
		GUILD = guild;
	});
	GUILD.roles.forEach((role) => {
		rolesByName[role.name] = role;
	});
	GUILD.emojis.forEach((emoji) => {
		emojisByName[emoji.name] = emoji;
	});
	client.channels.forEach((channel) => {
		channelsByName[channel.name] = channel;
	});

	CHATCOMMANDS = chatCommandsFunc({
		GUILD,
		rolesByName,
		channelsByName,
		getEmoji,
	});

	console.log('Asynchronous data loaded!'); // eslint-disable-line
});

client.on('message', message => {

	try {
		if ((message.member && message.member.id === CONSTANTS.BOTID) ||
			(message.author && message.author.id === CONSTANTS.BOTID)) return;

		if ((message.member && message.member.bot === true) || (message.author && message.author.bot === true)) return;
		//TESTING PURPOSES ONLY PLEASE REMOVE
		//if (message.channel.name !== 'professor_redwood') return;

		if (message.channel.type === 'dm' || message.channel.type === 'group') {
			message.channel.send('I currently have no direct message functions. Please go to channel #start_here');
			return;
		}

		if (message.content[0] !== '!') {
			if (message.member)	{CHATCOMMANDS.checkNew(message);}
			return;
		}

		let reply = '';
		const command = message.content.split(' ')[0];

		//Outside of Professor Redwood Channel, Message.member has NOT been null checked yet
		if (command === '!raid') {
			if (message.channel.name.indexOf('-') === -1) {
				reply = message.member.displayName + ', raid commands should only be run in the corresponding neighborhood channel';
				message.channel.send(reply);
				return reply;
			}
			CHATCOMMANDS.raid(message);
		}
		//Inside Professor Redwood Channel, Do not touch message.member
		else if (message.channel.name !== 'professor_redwood') {
			message.channel.send(message.member.displayName + ', you may only run this command in the ' + channelsByName['professor_redwood'] + ' channel');
			return;
		}

		if (command === '!breakpoint' || command === '!bp') {return CHATCOMMANDS.breakpoint(message);}
		else if (command === '!cp') {return CHATCOMMANDS.cp(message);}
		else if (command === '!counter' || command === '!counters') {CHATCOMMANDS.counters(message);}
		else if (command === '!help') {CHATCOMMANDS.help(message);}

		//Inside Professor Redwood Channel, OK to touch message.member
		if (reply === '' && !message.member) {
			message.channel.send('Member is a ' + getEmoji('gengar') + ' - Commands cannot be run for users who are invisible, please remove your invisible status');
			return;
		}

		if (command === '!play') {CHATCOMMANDS.play(message);}
		else if (command === '!team') {CHATCOMMANDS.team(message);}
		else if (command === '!want') {CHATCOMMANDS.want(message);}
	}
	catch (ex) {
		message.channel.send(`Sorry ${message.member.displayName}.  Looks like I've broken down on what you wanted. Here's an error to help @tech.  "${ex.message}"`);
		console.error('Testing ', ex);
	}



});

client.login(token);
