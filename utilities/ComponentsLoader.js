const FolderReader = require('./FolderReader.js');
const { existsSync } = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const { PermissionsBitField: { Flags: Permissions } } = require('discord.js');

const modules = [
	'commands',
	'buttons',
	'dropdowns',
	'modals',
];

module.exports = function (client) {
	for (const module of modules) {
		client[module] = new Map();

		if (!existsSync(`${__dirname}/../${module}`)) continue;

		const files = FolderReader(module);
		for (const { path, data } of files) {
			try {
				if (!data.execute) throw `No execute function found`;
				if (typeof data.execute !== 'function') throw `Execute is not a function`;

				if (module === 'commands') {
					if (!(data.data instanceof SlashCommandBuilder)) throw 'Invalid command - Must use the slash command builder';
					client[module].set(data.data.name, data);
				} else {
					if (!data.customID) throw 'No custom ID has been set';
					if (typeof (data.customID ?? data.customId) !== 'string') throw 'Invalid custom ID - Must be string';
					client[module].set(data.customID, data);
				}
			} catch (error) {
				console.error(`[${module.toUpperCase()}] Failed to load ./${path}: ${error.stack || error}`);
			}

		}
		console.log(`Loaded ${client[module].size} ${module}`)
	}
};
