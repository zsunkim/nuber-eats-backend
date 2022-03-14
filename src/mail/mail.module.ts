import { DynamicModule, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/entities/common.constants';
import { MailModuleInterface } from './mail.interface';

@Module({})
export class MailModule {
    static forRoot(options: MailModuleInterface): DynamicModule {
        return {
            module: MailModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },

            ],
            exports: [],
        }
    }
}
