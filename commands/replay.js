module.exports = {
    name: 'replay',
    description: 'Повторить текущую аудиозапись',
    execute(DISCORDMessage) {
        if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы повторить музыку!');
        if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id)) return DISCORDMessage.channel.send('Нет песни, которую я мог бы повторить!');
        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs.splice(1, 0, DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs[0]);
        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.end();
    },
};