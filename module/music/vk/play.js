let he = require('he');

module.exports = async (DISCORDMessage, DISCORDClient, url, title, img_url, artist, duration) => await new Promise(async (resolve, reject) => {
    if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id)) {

        DISCORDMessage.client.queue.set(DISCORDMessage.guild.id, {
            textChannel: DISCORDMessage.channel,
            voiceChannel: DISCORDMessage.member.voice.channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true,
            player: '',
            react_back: '',
            react_play_pause: '',
            react_next: '',
            react_stop: ''
        });

        DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs.push({ Title: unescape(title), URL: url, Img_url: img_url, Artist: artist, Duration: duration });

        try {
            DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).connection = await DISCORDMessage.member.voice.channel.join();
            DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player = await DISCORDMessage.channel.send(DISCORDClient.embed);

            DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).react_back = DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player.react('⬅️')
            .then(() => DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).react_play_pause = DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player.react('⏯️'))     
            .then(() => DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).react_next = DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player.react('➡️'))
            .then(() => DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).react_stop = DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).player.react('⏹️'))

            Play(DISCORDMessage, DISCORDClient, DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs[0]);
            resolve(true);
        } catch (err) {
            console.log(err);
            await DISCORDMessage.client.queue.delete(DISCORDMessage.guild.id);
            await DISCORDMessage.channel.send(err);
            reject(false);
        }
    } else {
        await DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs.push({ Title: unescape(title), URL: url, Img_url: img_url, Artist: artist, Duration: duration });
        if (url.indexOf('.mp3') === -1) { return DISCORDMessage.channel.send(`**${title}** была добавлена в очередь!`); }
        resolve(true);
    }
})

async function Play(message, client, song) {
    if (!song) {
        message.client.queue.get(message.guild.id).voiceChannel.leave();
        message.client.queue.delete(message.guild.id);
        return;
    }
    message.client.queue.get(message.guild.id).connection.play(song.URL).on("finish", () => {
        message.client.queue.get(message.guild.id).songs.shift();
        Play(message, client, message.client.queue.get(message.guild.id).songs[0]);
    })
        .on("error", error => console.error(error));


    let title = he.decode(song.Title);

    let url_artist;
    if (song.Artist != 0) { url_artist = `https://vk.com/artist/${song.Artist}` } else {
        url_artist = `https://vk.com/audios0?q=${escape(title.split("-")[0].replace(/(^\s*)|(\s*)$/g, ''))}`;
    }
    if (song.Img_url == "") { song.Img_url = `https://i.ibb.co/yQ7zz3R/logo-80x80.png` }

    message.client.queue.get(message.guild.id).player.edit(client.embed
        .setTitle(title)
        .setAuthor(title.split("-")[0], song.Img_url, url_artist)
        .setColor(0x2f3136)
        .setDescription(`[⬇](${song.URL})     **${(Math.floor(song.Duration / 60) + ': ' + song.Duration % 60)}**`)
        .setThumbnail(song.Img_url));
}