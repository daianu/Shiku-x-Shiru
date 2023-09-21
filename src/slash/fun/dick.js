const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dick')
    .setDescription('Виртуально измеряет размер вашего маленького дружка.'),
  async execute(interaction) {
    const minValue = 1;
    const maxValue = 50;
    const randomSize = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;

    // Генерация строки из символов "=" для указания размера
    const sizeString = '='.repeat(randomSize) + 'D';

    const embed = new MessageEmbed()
      .setColor('#FFFAFA')
      .setTitle('Нейронный измеритель')
      .addField('Образ вашего дружка', sizeString)
      .addField('Его длина', `${randomSize} см`);

    await interaction.reply({ embeds: [embed] });
  },
};
