module.exports = (async (DISCORDMessage, url, title) => {
    if (!DISCORDMessage.member.voice.channel)
        return DISCORDMessage.channel.send("You need to be in a voice channel to play music!");
    if (!DISCORDMessage.member.voice.channel.permissionsFor(DISCORDMessage.client.user).has("CONNECT") ||
        !DISCORDMessage.member.voice.channel.permissionsFor(DISCORDMessage.client.user).has("SPEAK")) {
        return DISCORDMessage.channel.send("I need the permissions to join and speak in your voice channel!");
    }

    if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id)) {

        DISCORDMessage.client.queue.set(DISCORDMessage.guild.id, {
            textChannel: DISCORDMessage.channel,
            voiceChannel: DISCORDMessage.member.voice.channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        });

        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs.push({ Title: title, URL: url });

        try {
            DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection = await DISCORDMessage.member.voice.channel.join();
            Play(DISCORDMessage, DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs[0]);
        } catch (err) {
            console.log(err);
            DISCORDMessage.client.queue.delete(DISCORDMessage.guild.id);
            return DISCORDMessage.channel.send(err);
        }
    } else {
        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs.push({ Title: title, URL: url });
        if (url.indexOf('.mp3') === -1) { return DISCORDMessage.channel.send(`**${title}** была добавлена в очередь!`); }
    }
})

async function Play(message, song) {
    if (!song) {
        message.client.queue.get(message.guild.id).voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
    }
    message.client.queue.get(message.guild.id).connection.play(song.URL).on("finish", () => {
        message.client.queue.get(message.guild.id).songs.shift();
        Play(message, message.client.queue.get(message.guild.id).songs[0]);
    })
        .on("error", error => console.error(error));
    await message.client.queue.get(message.guild.id).textChannel.send(`Start playing: **${song.Title}**`);
}