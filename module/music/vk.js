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
                            res.item.map((i) => {
                                play(DISCORDMessage, i.link, i.name);
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
                            res.item.map((i) => {
                                play(DISCORDMessage, i.link, i.name);
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
                            res.item.map((i) => {
                                play(DISCORDMessage, i.link, i.name);
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

async function searchPlay() {

}

module.exports = { urlPlay, searchPlay }