import { makeGetDataRoute } from './get-data'
import { makeSetDataRoute } from './set-data'
import { Router } from 'express'
import { User } from '@database/models/user'
import { PwdRecoverToken } from '@database/models/pwd-recovery-token'
import { makeSendPwdRecoveryRoute } from './send-recover-password'
import { makeValidatePwdRecoveryRoute } from './validate-recover-password'
import { makeResetPwdRecoveryRoute } from './reset-password'

export interface RoutesMaker {
  getDataRoute: Router
  setDataRoute: Router
  pwdRecoveryRoute: Router
  validatePwdRecoveryRoute: Router
  resetPwdRecoveryRoute: Router
}

export const routesMaker = (router: Router) => ({
  getDataRoute: makeGetDataRoute(router, User),
  setDataRoute: makeSetDataRoute(router, User),
  pwdRecoveryRoute: makeSendPwdRecoveryRoute(router, PwdRecoverToken, User),
  validatePwdRecoveryRoute: makeValidatePwdRecoveryRoute(
    router,
    PwdRecoverToken
  ),
  resetPwdRecoveryRoute: makeResetPwdRecoveryRoute(
    router,
    PwdRecoverToken,
    User
  ),
})
