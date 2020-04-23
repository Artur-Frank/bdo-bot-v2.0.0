const music = require('./vk/playlist');
const play = require('./vk/play')
const mask = require('../mask');
const config = require('../../config.json');


async function urlPlay(DISCORDMessage, DISCORDClient, VKClient) {
    try {
        const commands = DISCORDMessage.content.replace(`${config.prefix}play`, "").replace(/(^\s*)|(\s*)$/g, '').split(" ");
        if (mask.compares(commands[0], /https:\/\/[wm.]*vk\.com\/audios[0-9]*/)) {
            mask.parse(commands[0], 'https://vk.com/audios[data]', '[data]', (err, res) => {
                if (!err) {
                    music(VKClient, {
                        access_hash: '',
                        act: 'load_section',
                        al: 1,
                        claim: 0,
                        offset: 0,
                        owner_id: res[0],
                        playlist_id: -1,
                        track_type: 'default',
                        type: 'playlist'
                    }, 50, (res) => {
                        if (res) {
                            res.item.map(async (i) => {
                                await play(DISCORDMessage, DISCORDClient, i.link, i.name, i.image, i.artist, i.duration);
                            })
                        }
                    })
                }
            })
        }
        else if (mask.compares(commands[0], /https:\/\/[mw.]*vk\.com\/audios[0-9]*\?z=audio_playlist[-0-9]*_[0-9]*/)) {
            mask.parse(commands[0], 'https://vk.com/audios[data]?z=audio_playlist[data]_[data]', '[data]', (err, res) => {
                if (!err) {
                    music(VKClient, {
                        access_hash: '',
                        al: 1,
                        claim: 0,
                        context: '',
                        from_id: res[0],
                        is_loading_all: 1,
                        is_preload: 0,
                        offset: 0,
                        owner_id: res[1],
                        playlist_id: res[2],
                        type: 'playlist',
                    }, 50, (res) => {
                        if (res) {
                            res.item.map(async (i) => {
                                await play(DISCORDMessage, DISCORDClient, i.link, i.name, i.image, i.artist, i.duration);
                            })
                        }
                    })
                }
            })
        }
        else if (mask.compares(commands[0], /https:\/\/[mw.]*vk\.com\/audios[0-9]*\?z=audio_playlist[-0-9]*_[0-9]*%2F[A-Za-z0-9]*/)) {
            mask.parse(commands[0], 'https://vk.com/audios[data]?z=audio_playlist[data]_[data]%2F[data]', '[data]', (err, res) => {
                if (!err) {
                    music(VKClient, {
                        access_hash: res[3],
                        al: 1,
                        claim: 0,
                        context: '',
                        from_id: res[0],
                        is_loading_all: 1,
                        is_preload: 0,
                        offset: 0,
                        owner_id: res[1],
                        playlist_id: res[2],
                        type: 'playlist',
                    }, 50, (res) => {
                        if (res) {
                            res.item.map(async (i) => {
                                await play(DISCORDMessage, DISCORDClient, i.link, i.name, i.image, i.artist, i.duration);
                            })
                        }
                    })
                }
            })
        }
    } catch (err) {
        return DISCORDMessage.channel.send(`**Команда введена не верно! Справка : ${config.prefix}help**`);
    }
}

async function searchPlay(DISCORDMessage, DISCORDClient, VKClient) {
    const commands = DISCORDMessage.content.replace(`${config.prefix}play`, "").replace(/(^\s*)|(\s*)$/g, '').split(" ");
    mask.parse(commands[0], '[data]', '[data]', (err, res) => {
        if (!err) {
            music(VKClient, {
                act: 'section',
                al: 1,
                claim: 0,
                is_layer: 0,
                owner_id: 541919523,
                q: res[0],
                section: 'search',
            }, 10, async (res) => {
                if (res) {
                  await new Promise(async (resolve, reject) => {
                    resolve(res.item.map((item, index) => {
                        return `:white_small_square: **[${index}]**   :    **${item.name}** \n`;
                    }))}).then(async (list) => {
                        const msg = await DISCORDMessage.channel.send('.\n' + list);

                        let choose_music = async com => {
                            if (com.author.bot) return;

                            if (com.content.indexOf(config.prefix) !== 0) return;

                            const args = com.content.slice(config.prefix.length).trim().split(/ +/g);
                            const command = args.shift().toLowerCase();

                            if (command == "0" ||
                                command == "1" ||
                                command == "2" ||
                                command == "3" ||
                                command == "4" ||
                                command == "5" ||
                                command == "6" ||
                                command == "7" ||
                                command == "8" ||
                                command == "9") {
                                await play(DISCORDMessage, DISCORDClient,
                                    res.item[parseInt(command)].link,
                                    res.item[parseInt(command)].name,
                                    res.item[parseInt(command)].image,
                                    res.item[parseInt(command)].artist,
                                    res.item[parseInt(command)].duration);
                                    msg.delete();
                                    com.delete();
                                    DISCORDClient.off('message', choose_music);
                            }
                            else {
                                msg.delete();
                                com.delete();
                                DISCORDClient.off('message', choose_music);
                            }
                        }
                        DISCORDClient.on('message', choose_music);
                    })


                }
            })
        }
    })
}

module.exports = { urlPlay, searchPlay }