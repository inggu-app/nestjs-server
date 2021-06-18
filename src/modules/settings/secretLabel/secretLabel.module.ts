import { Module } from '@nestjs/common'
import { SecretLabelController } from './secretLabel.controller'
import { TypegooseModule } from 'nestjs-typegoose'
import { SecretLabelService } from './secretLabel.service'
import { SecretLabelModel } from './secretLabel.model'

@Module({
  controllers: [SecretLabelController],
  providers: [SecretLabelService],
  imports: [
    TypegooseModule.forFeature([
      {
        typegooseClass: SecretLabelModel,
        schemaOptions: {
          collection: 'Settings',
        },
      },
    ]),
  ],
})
export class SecretLabelModule {}
