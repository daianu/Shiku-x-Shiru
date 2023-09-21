const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kiss')
    .setDescription('Поцеловать участника.')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Укажите участника, которого вы хотите поцеловать')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const user = interaction.options.getUser('участник');

      if (!user) {
        interaction.reply('Укажите участника, вы хотите поцеловать.');
        return;
      }

      // Получаем случайное изображение "поцелуя" с помощью API waifu.pics
      const response = await axios.get('https://waifu.pics/api/sfw/kiss');
      const imageUrl = response.data.url;

      // Создаем изображение с поцелуем
      const kissImage = new MessageAttachment(imageUrl, 'kiss.gif');
      const embed = new MessageEmbed()
        .setTitle(`${interaction.user.username} поцеловал(-а) ${user.username}`)
        .setColor('#FF69B4')
        .setImage('attachment://kiss.gif');

      interaction.reply({ embeds: [embed], files: [kissImage] });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при отправке поцелуя.');
    }
  },
};
