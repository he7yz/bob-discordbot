require('dotenv').config();

// const { REST , Routes} = require('@discordjs/rest'); this was from the docs, doesnt call Routes properly. Needs to be independent

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');

module.exports = (client) => {

    console.log('Started refreshing Bob (/) commands.');
    // console.log(process.env.BOB_ID) check if called correctly

    const commands = [];
    for (const [_, command] of client.commands) {
        try {
            commands.push( command.data.toJSON() );
        } catch(error) {
            console.log(`[REGISTER] Failed to register ${command.data.name}: ${error}`);
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOB_TOKEN);
    try {
        rest.put(
            Routes.applicationCommands(process.env.BOB_ID),
            { body: commands },
        );
    
        console.log('Successfully reloaded Bob (/) commands.');
    } catch (error) {
        console.log(error);
    }
}
