export enum UserType {
  ADMIN = 1,
  QSA = 2,
  QA = 3,
  CONSULTANT = 4,
  CUSTOMER = 5,
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETE = 'delete',
}

export enum StatusType {
  DEFAULT = 0,
  QSA_APPROVED = 1,
  QSA_REJECTED = 2,
  IN_PROGRESS = 3,
  QA_APPROVED = 4,
  QA_REJECTED = 5,
  QA_INCOMPLETE = 6,
  ADMIN_APPROVED = 7,
  ADMIN_REJECTED = 8,
  ADMIN_INCOMPLETE = 9,
}

export enum RoleActionStatus {
  APPROVED = 1,
  DISAPPROVED = 2,
  IN_PROGRESS = 3,
  MARK_INCOMPLETE = 4,
}
