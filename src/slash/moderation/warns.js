const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessagePayload, MessageEmbed } = require('discord.js');
const fs = require('fs/promises');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Просмотреть количество и список варнов у участника')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, у которого нужно просмотреть варны')
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.member;
    const targetUser = interaction.options.getUser('участник');

    if (!member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply('У вас нет прав на просмотр варнов.');
    }

    if (!targetUser) {
      return interaction.reply('Пожалуйста, укажите участника, количество и список варнов которого вы хотите узнать.');
    }

    try {
      const data = await fs.readFile('./warns.json', 'utf8');
      const warns = JSON.parse(data);

      if (!warns[interaction.guild.id] || !warns[interaction.guild.id][targetUser.id]) {
        return interaction.reply('У указанного участника нет предупреждений на сервере.');
      }

      const warnData = warns[interaction.guild.id][targetUser.id];
      const warnCount = warnData.length;
      const warnsList = warnData.map((warn, index) => `**${index + 1}.** Причина: ${warn.reason}, Модератор: ${warn.moderator}`);

      const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle(`Предупреждения для ${targetUser.tag}`)
        .setDescription(`У участника ${targetUser.tag} есть ${warnCount} предупреждений:`)
        .addField('Список предупреждений', warnsList.join('\n'))
        .setFooter('Просмотр варнов');

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Ошибка при чтении файла warns.json:', error.message);
      interaction.reply('Произошла ошибка при чтении файла предупреждений.');
    }
  },
};
