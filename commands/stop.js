module.exports = {
	name: 'stop',
	description: 'Остановить воспроизведение аудио',
	execute(DISCORDMessage) {
		if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы остановить музыку!');
		DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs = [];
		DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.end();
	},
};