const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Выгнать участника')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Участник, которого нужно выгнать')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('причина')
        .setDescription('Причина выгнать (не обязательно)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const userToKick = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'не указана';

    if (!userToKick) {
      return interaction.reply('Участник не найден.');
    }

    if (!interaction.member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply('У вас нет прав на выгнать участников.');
    }
    
    const serverThumbnailURL = interaction.guild.iconURL({ format: 'png' });
    
    // Пытаемся выгнать пользователя с указанием причины
    try {
      await userToKick.send({
        embeds: [
          {
            color: 0xFF0000, // Красный цвет
            title: 'Вы были кикнуты',
            description: `Вы были кикнуты с сервера ${interaction.guild.name}.\nПричина: ${reason}`,
            thumbnail: { url: serverThumbnailURL }, // Добавляем серверный аватар к Embed
          },
        ],
      });

      await userToKick.kick(причина);
      interaction.reply({
        content: `${userToKick.user.tag} был успешно выгнан. Причина: ${reason}`,
      });
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при выполнении команды.');
    }
  },
};
