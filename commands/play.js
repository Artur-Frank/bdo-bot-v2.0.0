const config = require('../config.json');
const music = require('../module/music');

module.exports = {
    name: "play",
    description: "Воспроизведение музыки на канале",
    instruction: "",
    async execute(DISCORDMessage, DISCORDClient, VKClient) {
        try {
            const command = DISCORDMessage.content.replace(`${config.prefix}${this.name}`, "").replace(/(^\s*)|(\s*)$/g, '');
            if (command.indexOf('youtube.com') != -1 || command.indexOf('youtu.be') !== -1) {
                music.youtube();
            }
            else if (command.indexOf('vk.com') != -1) {
                music.vk.urlPlay(DISCORDMessage, DISCORDClient, VKClient);
            }
            else {
                DISCORDMessage.channel.send(`**Команда введена не верно! Справка : ${config.prefix}help**`);
            }
        } catch{
        return DISCORDMessage.channel.send(`**Команда выполнена неуспешно! Справка : ${config.prefix}help**`);
    }
}
}