import { REST, Routes, SlashCommandBuilder } from "discord.js";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Responde con Pong!")
    .toJSON(),

  new SlashCommandBuilder()
    .setName("guardar")
    .setDescription("Guarda una película para ver")
    .addStringOption((option) =>
      option
        .setName("titulo")
        .setDescription("Título de la película")
        .setRequired(true)
    )
    .toJSON(),

    new SlashCommandBuilder()
    .setName("lista")
    .setDescription("Muestra la lista de películas guardadas")
    .toJSON(),
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN!);

(async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
      body: commands,
    });
    console.log("✅ Comandos registrados exitosamente.");
  } catch (error) {
    console.error("❌ Error al registrar los comandos:", error);
  }
})();
