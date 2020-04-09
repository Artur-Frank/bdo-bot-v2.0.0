module.exports = {
    name: 'skip',
    description: 'Пропустить текущий аудиотрек',
    execute(DISCORDMessage) {
        if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы остановить музыку!');
        if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id)) return DISCORDMessage.channel.send('Нет песни, которую я мог бы пропустить!');
        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.end();
    },
};