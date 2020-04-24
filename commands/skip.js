module.exports = {
    name: 'skip',
    description: 'Пропустить текущий аудиотрек',
    execute(DISCORDMessage, check) {
        if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы остановить музыку!');
        if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id)) return DISCORDMessage.channel.send('Нет песни, которую я мог бы пропустить!');
        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.end();
        if (DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs.length == 1) {
            DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player.delete();
        }
        if(check) {
            DISCORDMessage.delete();
        }
    },
};