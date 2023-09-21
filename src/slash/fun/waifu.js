const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, User } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('waifu')
    .setDescription('Измерить любовь между участниками')
    .addUserOption(option =>
      option.setName('первый_участник')
        .setDescription('Первый участник')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('второй_участник')
        .setDescription('Второй участник')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const firstUser = interaction.options.getUser('первый_участник');
      const secondUser = interaction.options.getUser('второй_участник');

      if (!firstUser || !secondUser) {
        interaction.reply('Укажите двух участников для измерения уровня любви.');
        return;
      }

      // Генерируем случайное число для уровня любви
      const loveLevel = Math.floor(Math.random() * 101);

      const embed = new MessageEmbed()
        .setColor('#FF69B4')
        .setTitle('Измеритель уровня любви')
        .setDescription(`Уровень любви между **${firstUser.username}** и **${secondUser.username}** составляет **__${loveLevel}%__** ❤️`);

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при измерении уровня любви.');
    }
  },
};
