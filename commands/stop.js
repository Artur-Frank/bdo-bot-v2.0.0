module.exports = {
	name: 'stop',
	description: 'Остановить воспроизведение аудио',
	execute(DISCORDMessage, chack) {
		if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы остановить музыку!');
		DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs = [];
		DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection.dispatcher.end();
		DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player.delete();
		if (chack) {
			DISCORDMessage.delete();
		}

	},
};