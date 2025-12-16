import "dotenv/config";
import {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  TextBasedChannel,
} from "discord.js";
import { buscarPelicula } from "./services/tmdb.service";

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`🤖 Conectado como: ${client.user?.tag}`);
});

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // =====================
  // /ping
  // =====================
  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong!");
  }

  // =====================
  // /guardar
  // =====================
  if (interaction.commandName === "guardar") {
    const titulo = interaction.options.getString("titulo", true);
    const pelicula = await buscarPelicula(titulo);

    if (!pelicula) {
      return interaction.reply("❌ Película no encontrada");
    }

    const year = pelicula.release_date
      ? pelicula.release_date.slice(0, 4)
      : "¿?";

    const embed = new EmbedBuilder()
      .setTitle(`${pelicula.title} (${year})`)
      .setDescription(pelicula.overview || "Sin descripción")
      .setImage(`https://image.tmdb.org/t/p/w500${pelicula.poster_path}`)
      .setFooter({
        text: "👀 Pendiente | ✅ Vista",
      })
      .setColor(0x5865f2);

    const message = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    await message.react("👀");
    await message.react("✅");
  }

  // =====================
  // /lista
  // =====================
  if (interaction.commandName === "lista") {
    const channel = interaction.channel as TextBasedChannel;

    if (!channel) {
      return interaction.reply("❌ No se pudo acceder al canal.");
    }

    const messages = await channel.messages.fetch({ limit: 50 });

    const movieMessages = messages.filter(
      (msg) => msg.author.bot && msg.embeds.length > 0
    );

    if (movieMessages.size === 0) {
      return interaction.reply("📭 No hay películas guardadas todavía.");
    }

    const peliculas: string[] = [];

    movieMessages.forEach((msg) => {
      const embed = msg.embeds[0];
      if (embed.title) {
        peliculas.push(embed.title);
      }
    });

    const lista = peliculas
      .reverse()
      .map((titulo, index) => `${index + 1}. ${titulo}`)
      .join("\n");

    await interaction.reply({
      content: `🎬 **Películas guardadas:**\n\n${lista}`,
    });
  }
});
