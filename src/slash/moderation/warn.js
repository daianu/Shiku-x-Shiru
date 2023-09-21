const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');

// Загрузим список варнов из файла warns.json (если файл существует)
let warns = {};
try {
  const data = fs.readFileSync('./warns.json', 'utf8');
  warns = JSON.parse(data);
} catch (error) {
  console.error('Ошибка при загрузке warns.json:', error.message);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Выдать предупреждение участнику')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, которому нужно выдать предупреждение')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('причина')
        .setDescription('Причина выдачи предупреждения')
    ),
  async execute(interaction) {
    const member = interaction.member;
    const targetUser = interaction.options.getUser('участник');
    const reason = interaction.options.getString('причина') || 'Не указана';

    if (!member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply('У вас нет прав на выдачу предупреждений.');
    }

    if (!targetUser) {
      return interaction.reply('Пожалуйста, укажите участника для выдачи предупреждения.');
    }

    // Создаем или обновляем список варнов для участника
    if (!warns[interaction.guildId]) {
      warns[interaction.guildId] = {};
    }

    if (!warns[interaction.guildId][targetUser.id]) {
      warns[interaction.guildId][targetUser.id] = [];
    }

    const warnNumber = warns[interaction.guildId][targetUser.id].length + 1; // Получаем номер предупреждения

    warns[interaction.guildId][targetUser.id].push({ number: warnNumber, reason, moderator: member.user.tag });

    // Сохраняем обновленный список варнов в файл warns.json
    fs.writeFileSync('./warns.json', JSON.stringify(warns, null, 2), 'utf8');

    const warnCount = warns[interaction.guildId][targetUser.id].length;

    interaction.reply(`Участнику ${targetUser.tag} было выдано предупреждение #${warnNumber} (${warnCount} всего).\nПричина: ${reason}`);
  },
};
