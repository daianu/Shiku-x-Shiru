const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('love')
    .setDescription('Проявить к участнику чувства.')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Укажите участника, к которому испытываете чувства')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('участник');

      if (!user) {
        interaction.reply('Укажите участника, в которого вы влюблены.');
        return;
      }

      // Получаем случайное изображение "проявление любви" с помощью API waifu.pics
      const response = await axios.get('https://waifu.pics/api/sfw/hug');
      const imageUrl = response.data.url;

      // Создаем изображение с проявлением любви
      const loveImage = new MessageAttachment(imageUrl, 'love.gif');
      const embed = new MessageEmbed()
        .setTitle(`${interaction.user.username} проявляет чувства к ${user.username}`)
        .setColor('#FF69B4')
        .setImage('attachment://love.gif');

      interaction.reply({ embeds: [embed], files: [loveImage] });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при отправке проявления любви.');
    }
  },
};
