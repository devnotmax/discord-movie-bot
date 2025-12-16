import { SlashCommandBuilder } from "discord.js";

export const guardarCommand = new SlashCommandBuilder()
  .setName("guardar")
  .setDescription("Guarda una película para ver")
  .addStringOption((option) =>
    option
      .setName("titulo")
      .setDescription("Título de la película")
      .setRequired(true)
  );
