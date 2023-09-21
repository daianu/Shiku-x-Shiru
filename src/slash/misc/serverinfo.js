const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Информация о сервере'),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();

    await guild.members.fetch();

    const members = guild.members.cache;
    const totalMembers = members.size;
    const totalHumans = members.filter(member => !member.user.bot).size;
    const totalBots = members.filter(member => member.user.bot).size;

    const onlineMembers = members.filter(member => member.presence?.status === 'online').size;
    const idleMembers = members.filter(member => member.presence?.status === 'idle').size;
    const dndMembers = members.filter(member => member.presence?.status === 'dnd').size;
    const offlineMembers = totalMembers - (onlineMembers + idleMembers + dndMembers);

    const totalChannels = guild.channels.cache.size;
    const textChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size;
    const voiceChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size;
    const stageChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_STAGE_VOICE').size;

    const serverAvatarURL = guild.iconURL({ dynamic: true }) || '';

    const embed = new MessageEmbed()
      .setColor('#3498db')
      .setThumbnail(serverAvatarURL)
      .setTitle(`Информация о сервере "${guild.name}"`) // Добавляем название сервера
      .addFields(
        { name: 'Участники', value: `👥 Всего: ${totalMembers}\n🧑 Людей: ${totalHumans}\n🤖 Ботов: ${totalBots}`, inline: true },
        { name: 'По статусам', value: `🟢 В сети: ${onlineMembers}\n🟡 Неактивен: ${idleMembers}\n🔴 Не беспокоить: ${dndMembers}\n⚪ Не в сети: ${offlineMembers}`, inline: true },
        { name: 'Каналы', value: `📚 Всего: ${totalChannels}\n📝 Текстовых: ${textChannels}\n🔊 Голосовых: ${voiceChannels}\n🎙️ Трибун: ${stageChannels}`, inline: true },
        { name: 'Владелец', value: owner.user.tag, inline: true },
        { name: 'Уровень проверки', value: guild.verificationLevel, inline: true },
        { name: 'Дата создания', value: `${guild.createdAt.toDateString()}\n${Math.floor((Date.now() - guild.createdAt) / (1000 * 60 * 60 * 24 * 365))} год назад`, inline: true }
      );

    await interaction.reply({ embeds: [embed] });
  },
};
