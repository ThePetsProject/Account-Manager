import app from '../../../app'
import * as resetPwdRecoveryModules from '.'
import { User, UserType } from '../../database/models/user'
import { Request, Response } from 'express'
import {
  PwdRecoverToken,
  PwdRecoverTokenType,
} from '@src/infrastructure/database/models/pwd-recovery-token'

const { resetPwdRecoveryHandler } = resetPwdRecoveryModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const resMock = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

const fakePassword = 'fakePassword'
const fakeToken = 'fakeToken'

describe('Login route', () => {
  process.env.APP_BASE_URL = 'fake_base_url'
  process.env.RECOVER_PASSWORD_PATH = 'fake_path'

  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when token is created and sent', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce({} as UserType)
    User.updateOne = jest.fn().mockResolvedValueOnce({} as UserType)
    PwdRecoverToken.findOne = jest.fn().mockResolvedValueOnce({
      delete: jest.fn(),
    })

    const req = {
      body: {
        password: fakePassword,
        token: fakeToken,
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toBeCalledWith(204)
  })

  it('Should respond 404 when no token found', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce({} as UserType)
    User.updateOne = jest.fn().mockResolvedValueOnce({} as UserType)
    PwdRecoverToken.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        password: fakePassword,
        token: fakeToken,
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.status).toBeCalledWith(404)
    expect(response.send).toBeCalledWith({ message: 'No token' })
  })

  it('Should respond 404 when no user found', async () => {
    PwdRecoverToken.findOne = jest.fn().mockResolvedValueOnce({
      delete: jest.fn(),
    })
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        password: fakePassword,
        token: fakeToken,
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.status).toBeCalledWith(404)
    expect(response.send).toBeCalledWith({ message: 'No user' })
  })

  it('Should respond 400 when empty password is sent', async () => {
    const req = {
      body: {
        password: '',
        token: fakeToken,
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when no password is sent', async () => {
    const req = {
      body: {
        token: fakeToken,
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when token is empty', async () => {
    const req = {
      body: {
        password: fakePassword,
        token: '',
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when no token is sent', async () => {
    const req = {
      body: {
        password: fakePassword,
      },
    } as Request

    const response = await resetPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toBeCalledWith(400)
  })
})
