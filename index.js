const config = require('./config.json');
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const Client = require('./module/client/Client');
const easyvk = require("easyvk");
const readline = require('readline');

const client = new Client();
client.commands = new Discord.Collection();
client.embed = new Discord.MessageEmbed();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

async function main(vk) {
	vk.http.loginByForm({
		cookies: __dirname + "\\source\\cookies\\my-cookies.json"
	}).then(async (HTTPClient) => {

		client.on("ready", () => {
			console.log(`%cBot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`, 'color: orange');
			client.user.setActivity(`Black Desert Online`);
		});

		client.on("guildCreate", guild => {
			console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
			client.user.setActivity(`Black Desert Online`);
		});

		client.on("guildDelete", guild => {
			console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
			client.user.setActivity(`Black Desert Online`);
		});

		client.on("message", async message => {
			if (message.author.bot) return;

			if (message.content.indexOf(config.prefix) !== 0) return;

			const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
			const command = args.shift().toLowerCase();

			if (!client.commands.has(command)) return;

			try {
				client.commands.get(command).execute(message, client, HTTPClient);
			} catch (error) {
				console.error(error);
			}

		})
		client.login(config.token);
	})
}

async function logInWith2Auth(params) {
	return new Promise((_2faNeed) => {
		function relogIn(_2faCode = "") {
			if (_2faCode) params.code = _2faCode
			easyvk(params).then(main).catch((err) => {
				if (!err.easyvk_error) {
					if (err.error_code == "need_validation") {
						_2faNeed({
							err: err,
							relogIn: relogIn
						});
					}
				}
			})
		}
		relogIn()
	})
}

logInWith2Auth({
	username: config.username,
	password: config.password,
	sessionFile: path.join(__dirname, '\\source\\cookies\\.my-session'),
	reauth: true,
}).then(({ err: error, relogIn }) => {
	console.log(error.validation_type);
	rl.question(error.error + " ", (answer) => {
		let code = answer;
		relogIn(code);
		rl.close();
	});
})