

const {StreamChat} = require('stream-chat');

const streamChat = new StreamChat(
  sails.config.getstream.key,
  sails.config.getstream.secret,
);

module.exports = {

  friendlyName: 'Join',

  description: 'Join chat.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id: issue}) {
    const issueUser = await IssueUser.findOne({
      issue,
      user: this.req.session.userId
    });
    if (!issueUser) throw 'notFound';

    const {id, firstName, lastName} = await User
      .findOne(this.req.session.userId)
      .select(['firstName', 'lastName']);

    const username = `${firstName}${lastName}`;

    await streamChat.upsertUser({
      id: id.toString(),
      firstName,
      lastName,
      username,
      role: 'user'
    });
    const {name} = await Issue.findOne(issue).select(['name']);
    const channel = await streamChat.channel(
      'issue',
      issue.toString(),
      {
        name,
        'created_by_id': id.toString()
      }
    );
    await channel.create();
    await channel.addMembers([id.toString()]);

    return {
      token: streamChat.createToken(id.toString())
    };
  }

};
