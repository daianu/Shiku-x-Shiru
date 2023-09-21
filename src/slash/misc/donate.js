const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('donate')
    .setDescription('Показать информацию о поддержке автора.'),
  
  async execute(interaction) {
    const donateEmbed = new MessageEmbed()
      .setColor('#FFFAFA')
      .setTitle('Поддержать автора')
      .addField('DonationAlerts', 'https://www.donationalerts.com/r/daianu')
      .addField('Discord сервер поддержки', 'https://discord.gg/9Ha2mk7Jg9')
      .setFooter('Спасибо за поддержку! | Бот находится на бета-тесте')
      .setTimestamp();

    await interaction.reply({ embeds: [donateEmbed] });
  },
};
