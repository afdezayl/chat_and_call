import { Channel, ChannelType } from '@chat-and-call/channels/shared';
import { ContactsRepository } from '@chat-and-call/contacts/feature-server-contacts';
import {
  Access,
  Channel as ChannelEntity,
} from '@chat-and-call/database/entities';
import { EntityManager, EntityRepository, LoadStrategy } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ChannelsRepositoryService } from './channels-repository.service';

@Injectable()
export class ChannelsDataAccessService {
  constructor(
    @InjectRepository(Access)
    private readonly accessRepository: EntityRepository<Access>,
    @InjectRepository(ChannelEntity)
    private readonly channelRepository: EntityRepository<ChannelEntity>,
    private em: EntityManager,
    private channelsRepo: ChannelsRepositoryService,
    private contactsRepo: ContactsRepository
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
      .map((ch) => ({
        id: ch.uuid,
        title: ch.title,
        admin: null,
        type: ch.public ? ChannelType.Public : ChannelType.Private,
      }));

    const contacts = await this.contactsRepo.getContactsFromUser(user);
    const contactsChannels: Array<Channel> = contacts.map((x) => ({
      id: `${x.login1}-${x.login2}`,
      title: x.login1 === user ? x.login2 : x.login1,
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
        await this.em.transactional(async (em) => {
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

          console.log(ch, acc);
        });

        break;
      case ChannelType.Personal:
        break;
      default:
        console.error('Not implemented channel type creation');
    }
  }

  async checkChannelAccess(user: string, channel: string): Promise<boolean> {
    /* this.em.find(ChannelEntity, { uuid: channel }, {}); */
    const ch = await this.channelRepository.findOne({ uuid: channel });
    const hasAccess =
      (await this.accessRepository.count({ login: user, channel: ch?.id })) > 0;
    return hasAccess;
  }
}
