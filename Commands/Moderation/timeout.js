const {
  Client,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const database = require("../../Schemas/Infractions.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription(
      "Set a timeout to user."
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false)
    .addUserOption(options =>
      options
        .setName("target")
        .setDescription("Usuario a establecer el timeout")
        .setRequired(true)
    )
    .addStringOption(options =>
      options
        .setName("duración")
        .setDescription("Duración del timeout (30m, 1h, 1d)")
        .setRequired(true)
    )
    .addStringOption(options =>
      options
        .setName("razón")
        .setDescription("Razón del timeout.")
        .setMaxLength(512)
    ),
  /**
   * @param { Client } client
   * @param { ChatInputCommandInteraction } interaction
   */
  async execute(client, interaction) {

    const mentionable = interaction.options.getUser('target').value;
    const duration = interaction.options.getString('duración').value; // 1d 1 day, 1s 5s, 5m
    const reason = interaction.options.getString('razón')?.value || 'No especificado.';

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if(!targetUser) {
      await interaction.editReply("Este usuario no se encuentra en el servidor.");
      return;
    }
    if (targetUser.user.bot){
      await interaction.editReply("No se puede establecer un timeout para los bot.");
      return; 
    }

    const msDuration = ms(duration);
    if(isNaN(msDuration)){
      await interaction.editReply("Establece una duración valida. (1d 1 day, 1s 5s, 5m)");
      return;
    }

    if(msDuration < 5000 || msDuration > 2.419e9){
      await interaction.editReply("La duración del timeout no puede ser menor a 5 segundos ni mayor a 28 días.");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if(targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "No puedes establecer un timeout a este usuario porque tiene una posicion mayor o igual a la tuya."
        );
        return;
    }
    if(targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "No puedo establecer un timeout a este usuario porque tiene una posicion mayor o igual a la mia."
      );
      return;
    }

    //Timeout a user 
    try {
      const { default: prettyMs } = await import("pretty-ms");

      if(targetUser.isCommunicationDisabled()){
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`Se actualizó el timeout de ${targetUser} a ${prettyMs(msDuration, { verbose: true })}\nRazón: ${reason}`);
        return;
      }

      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(`Se a establecido un timeout de ${prettyMs(msDuration, { verbose: true })} para el usuario ${targetUser}\nRazón: ${reason}`);

    } catch (error) {
      console.log(`Ha ocurrido un error en el proceso: ${error}`)
    }

    // const { options, guild, member } = interaction;

    // const target = options.getUser("target");
    // const duration = options.getString("duration");
    // const reason = options.getString("reason");

    // const errorsArray = [];

    // const errorsEmbed = new EmbedBuilder()
    //   .setColor("Red")
    //   .setTitle("No se pudo establecer el timeout, vuelve a intentarlo.");

    // if (!target) return interaction.reply({
    //     embeds: [
    //       errorsEmbed.setDescription(
    //         "El miembro abandonó el servidor o has escrito mal su tag."
    //       ),
    //     ],
    //     ephemeral: true,
    //   });

    // if (!ms(duration) || ms(duration) > ms("28d"))
    //   errorsArray.push(
    //     "El tiempo no ha sido establecido correctamente o supera los 28 dias"
    //   );

    // if (!target.manageable || !target.moderatable)
    //   errorsArray.push(
    //     "El tag del usuario no puede ser moderado por este bot."
    //   );

    // if (member.roles.highest.position < target.roles.highest.position)
    //   errorsArray.push("La posición del rol del miembro es mayor a la tuya.");

    // if (errorsArray.length)
    //   return interaction.reply({
    //     embeds: [errorsEmbed.setDescription(errorsArray.join("\n"))],
    //     ephemeral: true,
    //   });

    // target.timeout(ms(duration), reason).catch((err) => {
    //   interaction.reply({
    //     embeds: [
    //       errorsEmbed.setDescription(
    //         "No se ha establecido el timeout porque a ocurrido un error poco común."
    //       ),
    //     ],
    //   })
    //   return console.log("Error en timeout.js", err)
    // });

    // const newInfractionsObject = {
    //     IssuerID: member.id,
    //     IssuerTag: member.user.tag,
    //     Reason: reason,
    //     Date: Date.now()
    // }

    // let userData = await database.findOne({Guild: guild.id, User: target.id});
    // if(!userData) userData = await database.create({Guild: guild.id, User: target.id, Infractions: [newInfractionsObject]});
    // else userData.Infractions.push(newInfractionsObject) && await userData.save();

    // const successEmbed = new EmbedBuilder()
    // .setTitle("Timeout Issues")
    // .setColor("Gold")
    // .setDescription([
    //     `${target} tiene un timeout de **${ms(ms(duration), {long: true})}** aplicado por ${member}`,
    //     `Total de infracciones: ${userData.Infractions.length}`,
    //     `\nRazón: ${reason}`
    // ].join("\n"));

    // return interaction.reply({ embeds: [successEmbed] });

  },
};
