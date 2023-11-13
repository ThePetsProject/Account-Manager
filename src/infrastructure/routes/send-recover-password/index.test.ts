import * as uuid from 'uuid'
import supertest from 'supertest'
import app from '../../../app'
import * as sendPwdRecoveryModules from '.'
import { User, UserType } from '../../database/models/user'
import { Request, Response } from 'express'
import {
  PwdRecoverToken,
  PwdRecoverTokenType,
} from '@src/infrastructure/database/models/pwd-recovery-token'
import axios, { AxiosError } from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

jest.mock('uuid')
const uuidSpy = jest.spyOn(uuid, 'v4').mockReturnValue('fakeuuid')

const { sendPwdRecoveryHandler } = sendPwdRecoveryModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const resMock = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

const fakeEmail = 'fake@email.com'

describe('Login route', () => {
  process.env.APP_BASE_URL = 'fake_base_url'
  process.env.RECOVER_PASSWORD_PATH = 'fake_path'
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when token is created and sent', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({} as UserType)
    PwdRecoverToken.create = jest
      .fn()
      .mockResolvedValueOnce({} as PwdRecoverTokenType)

    mockedAxios.request.mockResolvedValueOnce({})

    const req = {
      body: {
        email: fakeEmail,
      },
    } as Request

    const response = await sendPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toHaveBeenCalledWith(200)
  })

  it('Should respond 404 when User is not found', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        email: fakeEmail,
      },
    } as Request

    const response = await sendPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toHaveBeenCalledWith(404)
  })

  it('Should respond 500 when token could not be created', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({} as UserType)
    PwdRecoverToken.create = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        email: fakeEmail,
      },
    } as Request

    const response = await sendPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toHaveBeenCalledWith(500)
  })

  it('Should respond 400 when email is empty', async () => {
    const req = {
      body: {
        email: '',
      },
    } as Request

    const response = await sendPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toHaveBeenCalledWith(401)
  })

  it('Should respond 400 when email is not sent', async () => {
    const req = {
      body: {},
    } as Request

    const response = await sendPwdRecoveryHandler(
      PwdRecoverToken,
      User,
      req,
      resMock
    )
    expect(response.sendStatus).toHaveBeenCalledWith(401)
  })
})
