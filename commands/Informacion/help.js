const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "help", // Nombre del comando para ejecución y para helpcmd [OPCIONAL]
  category: "Información", // Categoría del comando para helpcmd [OPCIONAL]
  aliases: ["h", "commandinfo", "cmds", "cmd", "halp"], // Alias del comando para helpcmd [OPCIONAL]
  cooldown: 3, // Tiempo de espera del comando para ejecución y para helpcmd [OPCIONAL]
  usage: "help [Nombre del comando]", // Uso del comando para helpcmd [OPCIONAL]
  description: "Devuelve todos los comandos o un comando específico", // Descripción del comando para helpcmd [OPCIONAL]
  memberpermissions: [], // Permitir solo a miembros con permisos específicos ejecutar un comando [OPCIONAL]
  requiredroles: [], // Permitir solo a usuarios específicos con un rol ejecutar un comando [OPCIONAL]
  alloweduserids: [], // Permitir solo a usuarios específicos ejecutar un comando [OPCIONAL]
  minargs: 0, // Número mínimo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  maxargs: 0, // Número máximo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  minplusargs: 0, // Número mínimo de argumentos para el mensaje, separados con "++", 0 == ninguno [OPCIONAL]
  maxplusargs: 0, // Número máximo de argumentos para el mensaje, separados con "++", 0 == ninguno [OPCIONAL]
  argsmissing_message: "", // Mensaje si el usuario no tiene argumentos suficientes / no tiene argumentos suficientes, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  argstoomany_message: "", // Mensaje si el usuario tiene demasiados / no tiene argumentos suficientes / tiene demasiados argumentos adicionales, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      if (args[0]) {
        const embed = new MessageEmbed();
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        if (!cmd) {
          return message.reply({ embeds: [embed.setColor(ee.wrongcolor).setDescription(`No se encontró información para el comando **${args[0].toLowerCase()}**`)] });
        }
        if (cmd.name) embed.addField("**Nombre del comando**", `\`${cmd.name}\``);
        if (cmd.name) embed.setTitle(`Información detallada sobre: \`${cmd.name}\``);
        if (cmd.description) embed.addField("**Descripción**", `\`${cmd.description}\``);
        if (cmd.aliases) embed.addField("**Alias**", `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        if (cmd.cooldown) embed.addField("**Tiempo de espera**", `\`${cmd.cooldown} segundos\``);
        else embed.addField("**Tiempo de espera**", `\`${settings.default_cooldown_in_sec} segundo\``);
        if (cmd.usage) {
          embed.addField("**Uso**", `\`${prefix}${cmd.usage}\``);
          embed.setFooter("Sintaxis: <> = requerido, [] = opcional");
        }
        return message.reply({ embeds: [embed.setColor(ee.color)] });
      } else {
        const embed = new MessageEmbed()
          .setColor(ee.color)
          .setThumbnail(client.user.displayAvatarURL())
          .setTitle("MENÚ DE AYUDA 🔰 Comandos")
          .setFooter(`Para ver descripciones e información de comandos, escribe: ${prefix}help [NOMBRE DEL CMD]`, client.user.displayAvatarURL());
        const commands = (category) => {
          return client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
        };
        try {
          for (let i = 0; i < client.categories.length; i += 1) {
            const current = client.categories[i];
            const items = commands(current);
            embed.addField(`**${current.toUpperCase()} [${items.length}]**`, `> ${items.join(", ")}`);
          }
        } catch (e) {
          console.log(String(e.stack).red);
        }
        message.reply({ embeds: [embed] });
      }
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.reply({ embeds: [new MessageEmbed().setColor(ee.wrongcolor).setFooter(ee.footertext, ee.footericon).setTitle(`❌ ERROR | Se produjo un error`).setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)] });
    }
  },
};

/**
 * @INFO
 * Bot codificado por Tomato#6966 | https://github.com/Tomato6966/Discord-Js-Handler-Template
 * @INFO
 * Trabajo para Milrato Development | https://milrato.eu
 * @INFO
 * Por favor menciona a él / Milrato Development, al usar este código!
 * @INFO
 */
