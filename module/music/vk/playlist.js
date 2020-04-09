const decode = require('./decode');

async function PlayListMusic(HTTPClient, FromData, QuantityItem, callback) {
    try {
        let item = [];

        await HTTPClient.request('al_audio.php?act=load_section', FromData).then((res) => {
            if (typeof res.payload[1][0] != 'string') {
                if (res.payload[1][0] != false) {
                    res.payload[1][0].list.slice(0, QuantityItem).map(e => {
                        item.push({
                            type: "reload_audio",
                            link: "null",
                            name: e[4] + " - " + e[3],
                            body: `${e[1]}_${e[0]}_${e[13].split('//')[1]}_${e[13].split('//')[2].replace('/', "").slice(0, -1)}`,
                            userID: res.payload[1][0].ownerId,
                            duration: e[15].duration  
                        });
                    })
                    if (item.length > 0) { callback(item) } else { callback(undefined) }
                }
                else { callback(undefined) }
            }
            else {
                if (res.payload[1][0] != false) {
                    List = res.payload[1][0].list.slice(0, QuantityItem);
                    List.map(e => {
                        var o = e[13].split('//');

                        item.push(new Item(
                            "reload_audio",
                            "null",
                            e[4] + " - " + e[3],
                            `${e[1]}_${e[0]}_${o[1]}_${o[2].replace('/', "").slice(0, -1)}`,
                            res.payload[1][0].ownerId,
                            e[15].duration
                        ));
                    })
                    if (item.length > 0) { callback(item) } else { callback(undefined) }
                }
                else { callback(undefined) }
            }

        });
    } catch (err) { console.log(err); callback(undefined) }
}

async function GetMusic(HTTPClient, ListMusic, callback) {
    try {
        if (ListMusic.length > 5) {
            let id = "";
            for (let a = 0; a < ListMusic.length; a = a + 5) {
                for (let b = a; b < a + 5; b++) {
                    id += ListMusic[b].body + ',';
                }
                id += ListMusic[a].body + ',';

                await HTTPClient.request('al_audio.php', {
                    act: 'reload_audio',
                    al: 1,
                    ids: id.slice(0, -1)
                }).then((res) => {
                    for (let i = a, c = 0; i < a + 5; i++, c++) {
                        ListMusic[i].link = decode(res.payload[1][0][c][2], 541919523);
                    }
                    id = "";
                })
            }
            if (ListMusic.length > 0) { callback({item : ListMusic}) }
            else { callback(undefined) }
        }
    } catch { callback(undefined) }
}

module.exports = {
    async execute(HTTPClient, FromData, QuantityItem, callback) {
        try {
            await PlayListMusic(HTTPClient, FromData, QuantityItem, async (res) => {
                if (await res != undefined) {
                    await GetMusic(HTTPClient, res, async (list) => await callback(list))
                }
                else { await callback("No access to playlist") }
            });
        } catch { callback(undefined) }
    }
}