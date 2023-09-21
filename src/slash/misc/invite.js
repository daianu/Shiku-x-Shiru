const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Добавить бота на свой сервер'),

  async execute(interaction) {
    const inviteEmbed = new MessageEmbed()
      .setColor('#FFFAFA')
      .setTitle('Добавить бота на свой сервер')
      .setDescription('[**Добавить меня на сервер**](https://discord.com/api/oauth2/authorize?client_id=797083844922048582&permissions=1101659204678&scope=bot)')
      .setFooter(`Команду запросил ${interaction.user.tag} | Бот находится на бета-тестировании`)
      .setTimestamp();

    await interaction.reply({ embeds: [inviteEmbed] });
  },
};
