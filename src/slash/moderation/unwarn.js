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
    .setName('unwarn')
    .setDescription('Удалить предупреждение у участника')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, у которого нужно удалить предупреждение')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('номер')
        .setDescription('Номер предупреждения, которое нужно удалить')
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.member;
    const targetUser = interaction.options.getUser('участник');
    const warnNumber = interaction.options.getInteger('номер');

    if (!member.permissions.has('KICK_MEMBERS')) {
      return interaction.reply('У вас нет прав на удаление предупреждений.');
    }

    if (!targetUser) {
      return interaction.reply('Пожалуйста, укажите участника, у которого нужно удалить предупреждение.');
    }

    if (!warns[interaction.guildId] || !warns[interaction.guildId][targetUser.id]) {
      return interaction.reply('У указанного участника нет предупреждений на сервере.');
    }

    if (warnNumber <= 0 || warnNumber > warns[interaction.guildId][targetUser.id].length) {
      return interaction.reply('Указанный номер предупреждения недопустим.');
    }

    // Удаляем предупреждение
    const removedWarn = warns[interaction.guildId][targetUser.id].splice(warnNumber - 1, 1)[0];

    // Сохраняем обновленный список варнов в файл warns.json
    fs.writeFileSync('./warns.json', JSON.stringify(warns, null, 2), 'utf8');

    interaction.reply(`Предупреждение ${removedWarn.number} для участника ${targetUser.tag} было удалено.\nПричина: ${removedWarn.reason}`);
  },
};
