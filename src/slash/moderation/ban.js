const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessagePayload } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Забанить участника')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, которого нужно забанить')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('причина')
        .setDescription('Причина бана (не обязательно)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const userToBan = interaction.options.getMember('участник');
    const reason = interaction.options.getString('причина') || 'не указана';

    if (!userToBan) {
      return interaction.reply('Участник не найден.');
    }

    if (!interaction.member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('У вас нет прав на бан участников.');
    }

    // Получаем URL серверного аватара (thumbnail)
    const serverThumbnailURL = interaction.guild.iconURL({ format: 'png' });

    // Пытаемся забанить пользователя с указанием причины
    try {
      await userToBan.send({
        embeds: [
          {
            color: 0xFF0000, // Красный цвет
            title: 'Вы были забанены',
            description: `Вы были забанены на сервере ${interaction.guild.name}.\nПричина: ${reason}`,
            thumbnail: { url: serverThumbnailURL }, // Добавляем серверный аватар к Embed
          },
        ],
      });

      await interaction.guild.bans.create(userToBan, { reason });
      interaction.reply({
        content: `${userToBan.user.tag} был успешно забанен. Причина: ${reason}`,
        embeds: [], // Пустой массив embeds, чтобы избежать ошибки
      });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при выполнении команды.');
    }
  },
};
