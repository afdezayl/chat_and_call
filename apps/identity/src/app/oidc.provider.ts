import { Configuration, Provider } from 'oidc-provider';
const configuration: Configuration = {
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['https://oidcdebugger.com/debug'],
      grant_types: ['implicit'],
      response_types: ['id_token'],
    },
  ],
};
export const oidc = new Provider(
  `http://localhost:${process.env.IDENTITY_PORT}/api`,
  configuration
);
oidc.proxy = true;
