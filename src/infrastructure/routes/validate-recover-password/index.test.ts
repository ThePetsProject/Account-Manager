import supertest from 'supertest'
import app from '../../../app'
import * as validatePwdRecoveryModules from '.'
import { User } from '../../database/models/user'
import { Request, Response } from 'express'
import {
  PwdRecoverToken,
  PwdRecoverTokenType,
} from '@src/infrastructure/database/models/pwd-recovery-token'

const { validatePwdRecoveryHandler } = validatePwdRecoveryModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const resMock = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

const fakeToken = 'fakeToken'

describe('Login route', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when token is found', async () => {
    PwdRecoverToken.findOne = jest
      .fn()
      .mockResolvedValueOnce({} as PwdRecoverTokenType)

    const req = {
      body: {
        token: fakeToken,
      },
    } as Request

    const loginResponse = await validatePwdRecoveryHandler(
      PwdRecoverToken,
      req,
      resMock
    )
    expect(loginResponse.sendStatus).toBeCalledWith(200)
  })

  it('Should respond 404 when token is not found', async () => {
    PwdRecoverToken.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        token: fakeToken,
      },
    } as Request

    const loginResponse = await validatePwdRecoveryHandler(
      PwdRecoverToken,
      req,
      resMock
    )
    expect(loginResponse.sendStatus).toBeCalledWith(404)
  })

  it('Should respond 400 when token is empty', async () => {
    const req = {
      body: {
        token: '',
      },
    } as Request

    const loginResponse = await validatePwdRecoveryHandler(
      PwdRecoverToken,
      req,
      resMock
    )
    expect(loginResponse.sendStatus).toBeCalledWith(400)
  })

  it('Should respond 400 when token is not sent', async () => {
    const req = {
      body: {},
    } as Request

    const loginResponse = await validatePwdRecoveryHandler(
      PwdRecoverToken,
      req,
      resMock
    )
    expect(loginResponse.sendStatus).toBeCalledWith(400)
  })
})
