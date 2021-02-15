import { Channel, ChannelType } from '@chat-and-call/channels/shared';
import {
  Access,
  Channel as ChannelEntity,
} from '@chat-and-call/database/entities';
import { EntityRepository, LoadStrategy } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/mysql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { validate } from 'uuid';

const mapToGroupChannel = (ch: ChannelEntity): Channel => ({
  id: ch.uuid,
  title: ch.title,
  admin: null,
  type: ch.public ? ChannelType.Public : ChannelType.Private,
});

@Injectable()
export class ChannelsDataAccessService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: EntityRepository<Access>,
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: EntityRepository<ChannelEntity>,
    private em: EntityManager
  ) {}

  async getChannels(user: string): Promise<Array<Channel>> {
    const access = await this.accessRepository.find(
      { login: user },
      {
        populate: ['channel'],
        strategy: LoadStrategy.SELECT_IN,
      }
    );
    const groupChannels: Array<Channel> = access
      .map((acc) => (acc.channel as unknown) as ChannelEntity)
      .map(mapToGroupChannel);

    const contactsChannels: Array<Channel> = (
      await this.getFriendsChannels(user)
    ).map((f) => ({
      id: `${f.login1}+${f.login2}`,
      title: f.login1 === user ? f.login2 : f.login1,
      type: ChannelType.Personal,
      admin: null,
    }));

    return [...groupChannels, ...contactsChannels];
  }

  async createChannel(newChannel: {
    title: string;
    type: ChannelType;
    user: string;
  }) {
    switch (newChannel.type) {
      case ChannelType.Public:
        break;
      case ChannelType.Private:
        const channel = await this.em.transactional(async (em) => {
          const ch = em.create(ChannelEntity, {
            public: false,
            title: newChannel.title,
          });
          await em.persistAndFlush(ch);

          const acc = em.create(Access, {
            admin: true,
            channel: ch.id,
            login: newChannel.user,
          });

          await em.persistAndFlush(acc);

          return ch;
        });

        return mapToGroupChannel(channel);

        break;
      case ChannelType.Personal:
        break;
      default:
        console.error('Not implemented channel type creation');
    }
  }

  async checkChannelAccess(user: string, channel: string): Promise<boolean> {
    const isGroup = validate(channel);

    return isGroup
      ? this.isValidGroupAccess(user, channel)
      : this.isFriendChannel(user, channel);
  }

  private async getFriendsChannels(user: string) {
    const qb = this.em.getKnex();
    const friends = await qb
      .select<Array<{ login1: string; login2: string }>>([`login1`, `login2`])
      .from('friends')
      .where({ login1: user })
      .orWhere({ login2: user });
    return friends;
  }

  private async isValidGroupAccess(user: string, uuid: string) {
    const ch = await this.channelRepository.findOne({ uuid });
    return ch
      ? (await this.accessRepository.count({ login: user, channel: ch.id })) > 0
      : false;
  }

  private async isFriendChannel(user: string, channel: string) {
    const users = channel.split('+');
    if (users.length !== 2 || !users.includes(user)) {
      return false;
    }
    const [result] = await this.em
      .getKnex()
      .count({ count: '*' })
      .from('friends')
      .where({ login1: users[0], login2: users[1] });
    return (result.count ?? 0) > 0;
  }
}
