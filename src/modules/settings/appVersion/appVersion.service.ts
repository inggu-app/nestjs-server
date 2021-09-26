import { Injectable } from '@nestjs/common'
import { InjectModel } from 'nestjs-typegoose'
import { AndroidAppVersionModel } from './models/androidAppVersion.model'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { OperationSystems } from '../../../global/enums/OS'
import { IosAppVersionModel } from './models/iosAppVersion.model'
import { ANDROID_APP_VERSION_TYPE, IOS_APP_VERSION_TYPE } from '../settings.constants'
import { SetFeaturesDto } from './dto/setFeaturesDto'
import { DeleteVersionDto } from './dto/deleteVersionDto'

const androidFilter = {
  settingType: ANDROID_APP_VERSION_TYPE,
  isActive: true,
}

const iosFilter = {
  settingType: IOS_APP_VERSION_TYPE,
  isActive: true,
}

@Injectable()
export class AppVersionService {
  constructor(
    @InjectModel(AndroidAppVersionModel)
    private readonly androidAppVersionModel: ModelType<AndroidAppVersionModel>,
    @InjectModel(IosAppVersionModel)
    private readonly iosAppVersionModel: ModelType<IosAppVersionModel>
  ) {
    this.init().then()
  }

  private async init() {
    const androidAppVersion = await this.getCurrentVersion(OperationSystems.ANDROID)
    const iosAppVersion = await this.getCurrentVersion(OperationSystems.IOS)

    if (!androidAppVersion) {
      await this._create(OperationSystems.ANDROID)
    }

    if (!iosAppVersion) {
      await this._create(OperationSystems.IOS)
    }
  }

  async get(os: OperationSystems, version: string) {
    let appVersion
    switch (os) {
      case OperationSystems.ANDROID:
        appVersion = await this.androidAppVersionModel.findOne(androidFilter, {
          _id: 0,
          version: 1,
          features: 1,
        })
        if (appVersion) {
          appVersion.features = appVersion.features.filter(feature => feature.version > version)
        }
        return appVersion
      case OperationSystems.IOS:
        appVersion = await this.iosAppVersionModel.findOne(iosFilter, {
          _id: 0,
          version: 1,
          features: 1,
        })
        if (appVersion) {
          appVersion.features = appVersion.features.filter(feature => feature.version > version)
        }
        return appVersion
    }
  }

  getCurrentVersion(os: OperationSystems) {
    switch (os) {
      case OperationSystems.ANDROID:
        return this.androidAppVersionModel.findOne(androidFilter, { _id: 0, version: 1 })
      case OperationSystems.IOS:
        return this.iosAppVersionModel.findOne(iosFilter, { _id: 0, version: 1 })
    }
  }

  async setCurrentVersion(os: OperationSystems, version: string) {
    await this._update(os, { $set: { version } })

    return this.getCurrentVersion(os)
  }

  async setFeatures(os: OperationSystems, dto: SetFeaturesDto) {
    let appVersion
    switch (os) {
      case OperationSystems.ANDROID:
        appVersion = await this.androidAppVersionModel.findOne(androidFilter)
        if (appVersion) {
          appVersion.features = appVersion.features.filter(
            feature => feature.version !== dto.version
          )
          appVersion.features.push(dto)
          await appVersion.save()
        }
        break
      case OperationSystems.IOS:
        appVersion = await this.iosAppVersionModel.findOne(iosFilter)
        if (appVersion) {
          appVersion.features = appVersion.features.filter(
            feature => feature.version !== dto.version
          )
          appVersion.features.push(dto)
          await appVersion.save()
        }
        break
    }
  }

  async deleteVersion(dto: DeleteVersionDto) {
    let appVersion
    switch (dto.os) {
      case OperationSystems.ANDROID:
        appVersion = await this.androidAppVersionModel.findOne(androidFilter)
        if (appVersion) {
          appVersion.features = appVersion.features.filter(
            feature => feature.version !== dto.version
          )
          await appVersion.save()
        }
        break
      case OperationSystems.IOS:
        appVersion = await this.iosAppVersionModel.findOne(iosFilter)
        if (appVersion) {
          appVersion.features = appVersion.features.filter(
            feature => feature.version !== dto.version
          )
          await appVersion.save()
        }
    }
  }

  private _update(os: OperationSystems, update: { [key: string]: any }) {
    switch (os) {
      case OperationSystems.ANDROID:
        return this.androidAppVersionModel.findOneAndUpdate(androidFilter, update)
      case OperationSystems.IOS:
        return this.iosAppVersionModel.findOneAndUpdate(iosFilter, update)
    }
  }

  private _create(os: OperationSystems) {
    switch (os) {
      case OperationSystems.ANDROID:
        return this.androidAppVersionModel.create({})
      case OperationSystems.IOS:
        return this.iosAppVersionModel.create({})
    }
  }
}
