import { Channel, ChannelType } from '@chat-and-call/channels/shared';
import { ContactsRepository } from '@chat-and-call/contacts/feature-server-contacts';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import {
  Access,
  Channel as ChannelEntity,
} from '@chat-and-call/database/entities';
import { ChannelsRepositoryService } from './channels-repository.service';

@Injectable()
export class ChannelsDataAccessService {
  constructor(
    @InjectRepository(ChannelEntity)
    private readonly channelsRepository: EntityRepository<ChannelEntity>,
    @InjectRepository(Access)
    private readonly accessRepository: EntityRepository<Access>,
    private channelsRepo: ChannelsRepositoryService,
    private contactsRepo: ContactsRepository
  ) {}

  async getChannels(user: string): Promise<Array<Channel>> {
    const channels = await this.channelsRepo.getChannels(user);

    /* const publicChannels = await this.channelsRepository.find({ public: true });

    publicChannels.forEach((ch) => console.log(ch));

    const access = await this.accessRepository.find({ login: user });
    console.log(access); */

    const mappedChannels: Array<Channel> = channels.map((ch) => ({
      id: ch.id.toString(),
      title: ch.title,
      admin: ch.admin,
      type: ch.public === 1 ? ChannelType.Public : ChannelType.Private,
    }));

    const contacts = await this.contactsRepo.getContactsFromUser(user);
    const contactsChannels: Array<Channel> = contacts.map((x) => ({
      id: `${x.login1}-${x.login2}`,
      title: x.login1 === user ? x.login2 : x.login1,
      type: ChannelType.Personal,
      admin: null,
    }));

    return [...mappedChannels, ...contactsChannels];
  }
}
