import { Module, INestApplication } from '@nestjs/common';
import { NestContainer } from '@nestjs/core';
import { Module as ContainerModule } from '@nestjs/core/injector/module';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { MODULE_METADATA } from '@nestjs/common/constants';
import {
  GATEWAY_METADATA,
  MESSAGE_MAPPING_METADATA,
  MESSAGE_METADATA,
} from '@nestjs/websockets/constants';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class GatewayExplorerModule {
  private _app: INestApplication;
  constructor(app: INestApplication) {
    this._app = app;
    this.printSocketMethods();
  }
  public printSocketMethods() {
    const modules = this.getModules();
    const gateways = this.getGateways(modules);

    gateways.forEach((gateway) => {
      console.log('------------------------------');
      console.log('   ' + gateway.constructor.name);
      console.log('------------------------------');

      const methods = this.getGatewayMethods(gateway);
      methods.forEach((m) =>
        console.log('--> ' + Reflect.getMetadata(MESSAGE_METADATA, m))
      );
    });
  }

  public getModules(): Array<ContainerModule> {
    const container: NestContainer = (this._app as any).container;
    const modules = container.getModules();

    return [...modules.values()];
  }

  public getGateways(modules: Array<ContainerModule>): Array<NestGateway> {
    const gateways: Array<any> = modules
      .map(
        (module) =>
          Reflect.getMetadata(MODULE_METADATA.PROVIDERS, module.metatype) || []
      )
      .reduce((acc, providers) => acc.concat(...providers.values()), [])
      .filter((prov) => Reflect.getMetadata(GATEWAY_METADATA, prov) === true)
      .map((prov) => {
        const gateway = this._app.get(prov) as NestGateway;
        Reflect.getOwnMetadataKeys(prov).forEach((key) => {
          Reflect.defineMetadata(
            key,
            Reflect.getOwnMetadata(key, prov),
            gateway
          );
        });
        return gateway;
      });

    return gateways;
  }

  getGatewayMethods(gateway: NestGateway): Array<InstanceWrapper> {
    const proto = Object.getPrototypeOf(gateway);
    const methodsNames = Object.getOwnPropertyNames(proto);
    return methodsNames
      .map((name) => gateway[name])
      .filter(
        (method) =>
          Reflect.getMetadata(MESSAGE_MAPPING_METADATA, method) &&
          Reflect.getMetadata(MESSAGE_METADATA, method)
      );
  }
}
