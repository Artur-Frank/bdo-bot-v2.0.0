'use strict'

const { Client, Collection, MessageEmbed } = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START'],
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;

		this.embed = new MessageEmbed();
	}
};