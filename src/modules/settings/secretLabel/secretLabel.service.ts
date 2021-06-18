import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { SecretLabelModel } from './secretLabel.model'
import { SECRET_LABEL_TYPE } from '../settings.constants'
import { CreateSecretLabelDto } from './dto/createSecretLabel.dto'

@Injectable()
export class SecretLabelService {
  constructor(
    @InjectModel(SecretLabelModel) private readonly secretLabelModel: ModelType<SecretLabelModel>
  ) {}

  getActiveSecretLabel(updatedAt: Date) {
    return this.secretLabelModel.findOne(
      {
        isActive: true,
        settingType: SECRET_LABEL_TYPE,
        updatedAt: { $gt: updatedAt },
      },
      { label: 1, updatedAt: 1, _id: 0 }
    )
  }

  deleteActiveSecretLabel() {
    return this.secretLabelModel.deleteOne({ isActive: true, settingType: SECRET_LABEL_TYPE })
  }

  createSecretLabel(dto: CreateSecretLabelDto) {
    return this.secretLabelModel.create({
      label: dto.label,
      settingType: SECRET_LABEL_TYPE,
      isActive: true,
    })
  }
}
