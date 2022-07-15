import supertest from 'supertest'
import app from '../../../app'
import * as loginModules from '.'
import { User } from '../../database/models/user'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const baseRoute = '/api/v1/account/login'
const { getDataHandler: loginHandler } = loginModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const responseTokens = {
  accToken: 'fakeacctoken',
  refToken: 'fakereftoken',
}
const mockTokensResponse = () =>
  mockedAxios.request.mockResolvedValueOnce({
    data: responseTokens,
  })

describe('Login route', () => {
  let request: supertest.SuperTest<supertest.Test>

  beforeAll(() => {
    request = supertest(app)
  })

  beforeEach(() => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      checkPassword: jest.fn().mockResolvedValueOnce(true),
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Should call method when root path', (done) => {
    jest.spyOn(loginModules, 'loginHandler')
    mockTokensResponse()

    request
      .post(`${baseRoute}/`)
      .send({
        email: 'fake@email.com',
        password: 'fakepwd',
      })
      .expect(200)
      .then(() => {
        expect(loginModules.getDataHandler).toHaveBeenCalled()
        done()
      })
  })

  it('Should respond 200 when password match', async () => {
    mockTokensResponse()

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(200)
    expect(loginResponse.send).toBeCalledWith(responseTokens)
  })

  it('Should respond 404 when no user found', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(404)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 401 when passwords wont match', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce({
      checkPassword: jest.fn().mockResolvedValueOnce(false),
    })

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(401)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 400 if passsword is not a string', async () => {
    const req = {
      body: {
        email: 'fake@email.com',
        password: 123,
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(400)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 400 if email is not an email', async () => {
    const req = {
      body: {
        email: 'notanemail.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(400)
    expect(loginResponse.send).toBeCalledWith()
  })

  it('Should respond 500 if axios returns error', async () => {
    const errorMsg = 'Error message'
    mockedAxios.request.mockRejectedValueOnce(new Error(errorMsg) as AxiosError)

    const req = {
      body: {
        email: 'fake@email.com',
        password: 'fakepwd',
      },
    } as Request

    const res = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    } as any as Response

    const loginResponse = await loginHandler(User, req, res)
    expect(loginResponse.status).toBeCalledWith(500)
    expect(loginResponse.send).toBeCalledWith({
      message: errorMsg,
    })
  })
})
