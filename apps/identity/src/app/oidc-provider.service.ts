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
          application_type: 'web',
          //client_secret: 'bar',
          token_endpoint_auth_method: 'none',
          redirect_uris: [
            'https://oidcdebugger.com/debug',
            'http://localhost:4201',
          ],
          post_logout_redirect_uris: [
            'http://localhost:4201'
          ],
          grant_types: ['implicit', 'refresh_token', 'authorization_code'],
          //response_types: ['id_token token', 'id_token', 'code id_token token']
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
          console.log('-------');
          console.warn(message, code);
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
