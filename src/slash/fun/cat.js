const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Показать случайное изображение кота.'),
  async execute(interaction) {
    try {
      // Используем динамический импорт для загрузки node-fetch
      const fetch = await import('node-fetch');

      const catData = await fetch.default('https://api.thecatapi.com/v1/images/search');
      const catJson = await catData.json();

      const catImageUrl = catJson[0].url;

      const embed = new MessageEmbed()
        .setColor('#FFFAFA')
        .setTitle('Случайный кот')
        .setImage(catImageUrl);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при получении изображения кота.');
    }
  },
};