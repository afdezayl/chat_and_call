import { Injectable } from '@nestjs/common';
import { ChannelsRepositoryService } from './channels-repository.service';
import { ContactsRepository } from '@chat-and-call/contacts/feature-server-contacts';
import { Channel, ChannelType } from '@chat-and-call/channels/shared';
import { win32 } from 'path';

@Injectable()
export class ChannelsDataAccessService {
  constructor(
    private channelsRepo: ChannelsRepositoryService,
    private contactsRepo: ContactsRepository
  ) {}

  async getChannels(user: string): Promise<Array<Channel>> {
    const channels = await this.channelsRepo.getChannels(user);

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
