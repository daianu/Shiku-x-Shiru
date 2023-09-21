const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dog')
    .setDescription('Показать случайное изображение собаки.'),
  async execute(interaction) {
    try {
      // Используем динамический импорт для загрузки node-fetch
      const fetch = await import('node-fetch');

      const dogData = await fetch.default('https://dog.ceo/api/breeds/image/random');
      const dogJson = await dogData.json();

      const dogImageUrl = dogJson.message;

      const embed = new MessageEmbed()
        .setColor('#FFFAFA')
        .setTitle('Случайная собака')
        .setImage(dogImageUrl);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при получении изображения собаки.');
    }
  },
};
