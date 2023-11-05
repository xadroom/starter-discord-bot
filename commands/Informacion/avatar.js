const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const { GetUser, GetGlobalUser } = require("../../handlers/functions");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "avatar", // Nombre del comando para ejecución y para helpcmd [OPCIONAL]
  category: "Información", // Categoría del comando para helpcmd [OPCIONAL]
  aliases: ["useravatar", "logo"], // Alias del comando para helpcmd [OPCIONAL]
  cooldown: 5, // Tiempo de espera del comando para ejecución y para helpcmd [OPCIONAL]
  usage: "avatar [@USUARIO] [global]", // Uso del comando para helpcmd [OPCIONAL]
  description: "Muestra el avatar de un usuario", // Descripción del comando para helpcmd [OPCIONAL]
  memberpermissions: [], // Permitir solo a miembros con permisos específicos ejecutar un comando [OPCIONAL]
  requiredroles: [], // Permitir solo a usuarios específicos con un rol ejecutar un comando [OPCIONAL]
  alloweduserids: [], // Permitir solo a usuarios específicos ejecutar un comando [OPCIONAL]
  minargs: 0, // Número mínimo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  maxargs: 0, // Número máximo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  minplusargs: 0, // Número mínimo de argumentos para el mensaje, separados por "++", 0 == ninguno [OPCIONAL]
  maxplusargs: 0, // Número máximo de argumentos para el mensaje, separados por "++", 0 == ninguno [OPCIONAL]
  argsmissing_message: "", // Mensaje si el usuario no tiene argumentos suficientes / no tiene argumentos suficientes, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  argstoomany_message: "", // Mensaje si el usuario tiene demasiados / no tiene argumentos suficientes / tiene demasiados argumentos adicionales, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      var user;
      try {
        if (args[1] && args[1].toLowerCase() == "global") {
          args.pop();
          user = await GetGlobalUser(message, args);
        } else {
          user = await GetUser(message, args);
        }
      } catch (e) {
        return message.reply(e);
      }
      message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setAuthor(
              `Avatar de: ${user.tag}`,
              user.displayAvatarURL({ dynamic: true }),
              "https://discord.gg/5YM48Tdyj2"
            )
            .setColor(ee.color)
            .addField("❱ PNG", `[Enlace](${user.displayAvatarURL({ format: "png" })})`, true)
            .addField("❱ JPEG", `[Enlace](${user.displayAvatarURL({ format: "jpg" })})`, true)
            .addField("❱ WEBP", `[Enlace](${user.displayAvatarURL({ format: "webp" })})`, true)
            .setURL(user.displayAvatarURL({ dynamic: true }))
            .setFooter(ee.footertext, ee.footericon)
            .setImage(user.displayAvatarURL({ dynamic: true, size: 512 })),
        ],
      });
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle(`❌ ERROR | Se produjo un error`)
            .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``),
        ],
      });
    }
  },
};

