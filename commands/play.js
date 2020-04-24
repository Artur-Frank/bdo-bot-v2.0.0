const config = require('../config.json');
const music = require('../module/music');

module.exports = {
    name: "play",
    description: "Воспроизведение музыки",
    instruction:                                                                
    `Данная   команда   воспроизводит   музыку   с   VK   и   YouTube
     для запуска требуется ввести команду в формате : **${config.prefix}play [url]**
     * **[url]** -  ссылка  на  альбом  или  личные  аудиозаписи  VK  или
     ссылка    на    YouTube
     
     Для свободного поиска  песен и  исполнителей  нужно  ввести:
     **${config.prefix}play [title_music]**
     * **[title_music]**  - Название  песни,   исполнителя  или  альбома`,
    async execute(DISCORDMessage, DISCORDClient, VKClient) {
        try {
            const command = DISCORDMessage.content.replace(`${config.prefix}${this.name}`, "").replace(/(^\s*)|(\s*)$/g, '');
            DISCORDMessage.delete();
            if (command.indexOf('youtube.com') != -1 || command.indexOf('youtu.be') !== -1) {
                music.youtube();
            }
            else if (command.indexOf('vk.com') != -1) {
                music.vk.urlPlay(DISCORDMessage, DISCORDClient, VKClient);
            }
            else if (command.indexOf('/list' != -1)) {
                
            }
            else if (command.length > 0) {
                music.vk.searchPlay(DISCORDMessage, DISCORDClient, VKClient);
            }
            else {
                DISCORDMessage.channel.send(`**Команда введена не верно! Справка : ${config.prefix}help**`);
            }
        } catch{
        return DISCORDMessage.channel.send(`**Команда выполнена неуспешно! Справка : ${config.prefix}help**`);
    }
}
}