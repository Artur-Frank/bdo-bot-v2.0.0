const fs = require('fs');
const config = require("../config.json");

module.exports = {
    name: 'help',
    description: 'Получение справки по коммандам',
    execute(DISCORDMessage, client) {

        const command = DISCORDMessage.content.replace(`${config.prefix}${this.name}`, "").replace(/(^\s*)|(\s*)$/g, '').split(" ");
        if (command[0] == "") {
            let str = '';
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const command = require(`./${file}`);
                str += `**${command.name}** : ${command.description} \n`;
            }
            DISCORDMessage.channel.send(client.embed
                .setColor(0xff4242)
                .setDescription(str));
        }
        else {
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            if (commandFiles.indexOf(`${command}.js`) != -1) {
                const com = require(`./${command[0]}.js`);
                if (com.instruction) {
                    DISCORDMessage.channel.send(client.embed
                        .setColor(0xff4242)
                        .setDescription(com.instruction));
                }
                else {
                    DISCORDMessage.channel.send(client.embed
                        .setColor(0xff4242)
                        .setDescription(`Комманда не принимает дополнительных данных. Используйте: **${config.prefix}${command}**`));
                }

            }
            else {
                DISCORDMessage.channel.send(client.embed
                    .setColor(0xff4242)
                    .setDescription("Запрашиваемая комманда отсутствует"));
            }
        }
    },
};