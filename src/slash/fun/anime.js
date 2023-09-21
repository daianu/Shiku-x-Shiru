const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anime')
    .setDescription('Отправить случайную аниме картинку.'),
  async execute(interaction) {
    try {
      const response = await axios.get('https://nekos.life/api/v2/img/neko');
      const data = response.data;

      const imageUrl = data.url;

      const embed = new MessageEmbed()
        .setColor('#FFFAFA')
        .setTitle('Случайная аниме картинка')
        .setImage(imageUrl);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при получении аниме изображения.');
    }
  },
};
