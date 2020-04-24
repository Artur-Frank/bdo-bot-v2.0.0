const config = require('../config.json');
const music = require('../module/music');

module.exports = {
    name: "pause",
    description: "Приостановить воспроизведение",
    async execute(DISCORDMessage, check) {
        try {
            if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы остановить музыку!');

            if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.paused) {
                DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.pause();
            }
            else {
                DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.resume();
            }
        } catch (err) {
            return DISCORDMessage.channel.send(`**Команда выполнена неуспешно! Справка : ${config.prefix}help**`);
        }
    }
}