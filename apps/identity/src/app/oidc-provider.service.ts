import { Injectable } from '@nestjs/common';
import { Configuration, Provider } from 'oidc-provider';
import { environment } from '../environments/environment';

@Injectable()
export class OidcProviderService {
  private oidc: Provider;

  constructor() {
    // TODO: Get from .env
    const configuration: Configuration = {
      clients: [
        {
          client_id: 'foo',
          client_secret: 'bar',
          redirect_uris: ['https://oidcdebugger.com/debug'],
          grant_types: ['implicit', 'refresh_token', 'authorization_code'],
          response_types: ['id_token', 'code'],
        },
      ],
      pkce: {
        methods: ['S256'],
        required: () => true,
      },
    };

    this.oidc = new Provider(
      `http://localhost:${process.env.IDENTITY_PORT}/api`,
      configuration
    );
    this.oidc.proxy = true;

    if (!environment.production) {
      const providerClient = this.oidc.Client as any;
      const { invalidate: original } = providerClient.Schema.prototype;

      providerClient.Schema.prototype.invalidate = function invalidate(
        message: any,
        code: any
      ) {
        if (
          code === 'implicit-force-https' ||
          code === 'implicit-forbid-localhost'
        ) {
          return;
        }

        original.call(this, message);
      };
    }
  }

  get callback() {
    return this.oidc.callback();
  }
}
