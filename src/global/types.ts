export type DeviceId = string

export type MongoIdString = string

export type ServiceMethodOptions<CheckExistence extends string = string> = {
  checkExistence?: Record<CheckExistence, boolean>
}
