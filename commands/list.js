const fs = require('fs');
const config = require("../config.json");

module.exports = {
    name: 'list',
    description: 'Получить список музыки',
    async execute(DISCORDMessage, client) {
        if (!DISCORDMessage.member.voice.channel) return DISCORDMessage.channel.send('Вы должны быть в голосовом канале, чтобы запросить список аудиозаписей');
        if (!DISCORDMessage.client.queue.get(DISCORDMessage.guild.id)) return DISCORDMessage.channel.send('Список воспроизводимых аудиозаписей пуст!');

        DISCORDMessage.delete();

        let list = DISCORDMessage.client.queue.get(DISCORDMessage.guild.id).songs;

        let page_track = [];
        let pages = [];
        let message_page = [];
        let index_page = 0;

        list.map((item, index) => {
            pages.push(`:white_small_square: **[${index + index_page}]**   :    **${item.Title}** \n`);
        })

        for (let i = 0; i < pages.length; i += 10) {
            page_track.push(pages.slice(i, i + 10));
        }

        page_track.map(item => {
            let str = ".\n";
            item.map((res) => {
                str += res;
            })

            message_page.push(str);
        })

        let msg = await DISCORDMessage.channel.send(message_page[0]);

        let page_list = async com => {

            if (com.author.bot) return;

            if (com.content.indexOf(config.prefix) !== 0) return;

            com.delete();

            const args = com.content.slice(config.prefix.length).trim().split(/ +/g);
            const command = args.shift().toLowerCase();

            if (command == "next") {
                if (index_page < page_track.length - 1) {
                    index_page ++;
                    await msg.edit(message_page[index_page]);               
                }
            }
            else if (command == "down") {
                if (index_page > 0) {
                    index_page --;
                    await msg.edit(message_page[index_page]);
                    
                }
            }
            else {
                client.off('message', page_list);
            }
        }

        client.on('message', page_list);
    },
};