const { Command } = require('discord.js-commando');

const userHasReportedBefore = (reports, userId) => {
  let reported = false;
  reports.forEach(report => {
    if (report.by === userId) reported = true;
  });
  
  return reported;
};

const reportAction = (userJson, reportsNeeded, targetUser, reportChannel) => {
  // Check if user needs to be kicked
  if (userJson.reports.length === reportsNeeded.kick) {
    targetUser.kick().then((member) => {
      // Success message
      reportChannel.send(`${member.toString()} has been successfully kicked`);
    }).catch((member) => {
      // Fail message
      reportChannel.send(`Access Denied for kicking ${member.toString()}`);
    });
  }
  
  if (userJson.reports.length === reportsNeeded.ban3days) {
    targetUser.ban(3).then((member) => {
      // Success message
      reportChannel.send(`${member.toString()} has been successfully banned for 3 days`);
    }).catch((member) => {
      // Fail message
      reportChannel.send(`Access Denied for banning ${member.toString()}`);
    });
  }
  
  if (userJson.reports.length === reportsNeeded.ban) {
    targetUser.ban().then((member) => {
      // Success message
      reportChannel.send(`${member.toString()} has been successfully banned forever`);
    }).catch((member) => {
      // Fail message
      reportChannel.send(`Access Denied for banning ${member.toString()}`);
    });
  }
};

module.exports = class ReportCommand extends Command {
  constructor(client) {
      super(client, {
          name: 'report',
          group: 'general',
          memberName: 'report',
          description: 'Reports improper behaviour of specific user.',
          examples: ['!report <user> <reason>'],
          guildOnly: false,
      });
  }

  async run(message) {
    try {
      const settings = require('../../settings');
      const fs = require('fs');
      
      const reportsNeeded = {kick: 3, ban3days: 4, ban: 5};
      
      const [command, user, ...reason] = message.content.split(' ').filter((str) => str);
      const targetUser = message.mentions.members.first();
      const reportChannel = client.channels.get(settings.reportChannel);
      const fileName = `./userdata/${targetUser.id}.json`;
      
      
      // Check for protected roles
      if (targetUser.roles.some(r => [
          "CoZ_Council",
          "NEO_China",
          "CoZ_Dev",
          "Community_Mod",
          "Security",
          "CoZ",
          "Meetup_Speaker",
          "Comms",
          "Translator",
          "NNT",
          "Marketing",
          "Consensus_node_host",
          "Hackathon",
          "CoZ_Strategy"
        ].includes(r.name))) {
        console.log('User was report but has a special role');
        return;
      }
      
      // Check if a reason is specified
      if (reason.length === 0) {
        return;
      }
      
      // The current report
      const report = {
        date: new Date(),
        reason: reason.join(' '),
        by: message.author.id
      };
      
      // Check if the user JSON exist
      fs.access(fileName, err => {
        if (!err || err.code !== 'ENOENT') {
          // Open user JSON
          fs.readFile(fileName, (err, fd) => {
            if (err) {
              console.log('readFile', err);
            } else {
              const userJson = JSON.parse(fd);
              
              // Check if user has been reported before
              if (userJson.reports) {
                
                if (!userHasReportedBefore(userJson.reports, message.author.id)) {
                  userJson.reports.push(report);
                  
                  reportChannel.send(`${targetUser.toString()} has been reported by **${message.author.toString()} for ${reason && reason.length > 0 ? reason.join(' ') : 'no reason specified'}** and has been reported **${userJson.reports.length}** times now`);
                  
                  reportAction(userJson, reportsNeeded, targetUser, reportChannel);
                }
              } else {
                userJson.reports = [report];
              }
              
              // Save the new data
              fs.writeFile(fileName, JSON.stringify(userJson), err => {
                if (err) console.log('error writing to file ' + fileName);
              });
            }
          });
        } else {
          reportChannel.send(`${targetUser.toString()} has been reported by ${message.author.toString()} for **${reason && reason.length > 0 ? reason.join(' ') : 'no reason specified'}**`);
          
          // Initial data
          const data = {
            reports: [
              report
            ]
          };
          
          fs.writeFile(fileName, JSON.stringify(data), err => {
            if (err) console.log('error writing to file ' + fileName);
          });
        }
      });
    } catch (e) {
      console.log('------REPORT ERROR------');
      console.log(e.message);
      console.log('------REPORT ERROR END------');
    }
  }
};