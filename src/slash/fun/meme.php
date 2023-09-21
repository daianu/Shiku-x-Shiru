const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const snoowrap = require('snoowrap');

// Настройте доступ к Reddit API. Укажите свой клиентский идентификатор и секретный ключ.
const reddit = new snoowrap({
  userAgent: 'Kuroko (by daianuu)',
  clientId: '1118137982084448276',
  clientSecret: 'hB_LCoWd5jNuvRMlGdu25nyHyKmcNumD',
  username: 'daianuu',
  password: 'iaaRRtGOr31//',
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Отправляет случайный мем с Reddit.'),
  async execute(interaction) {
    try {
      // Выполняем GET-запрос к Reddit API для получения случайного мема
      const subreddit = 'memes'; // Вы можете изменить на имя другого сабреддита
      const posts = await reddit.getSubreddit(subreddit).getRandomSubmission();
      
      if (!posts) {
        throw new Error('Не удалось получить мем.');
      }

      const meme = posts.url;

      const embed = new MessageEmbed()
        .setColor('#FFFAFA')
        .setTitle('Случайный мем с Reddit')
        .setImage(meme);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply('Произошла ошибка при получении мема.');
    }
  },
};
