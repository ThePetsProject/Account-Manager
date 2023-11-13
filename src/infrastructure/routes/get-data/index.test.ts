import supertest from 'supertest'
import app from '../../../app'
import * as getDataModules from '.'
import { User } from '../../database/models/user'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'

const mockRes = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

const baseRoute = '/api/v1/account/login'
const { getDataHandler } = getDataModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

describe('Get user data', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when user found', async () => {
    const fakeUser = {} as typeof User
    User.findOne = jest.fn().mockResolvedValueOnce(fakeUser)

    const req = {
      body: {
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const getDataResponse = await getDataHandler(User, req, mockRes)
    expect(getDataResponse.status).toHaveBeenCalledWith(200)
    expect(getDataResponse.send).toHaveBeenCalledWith(fakeUser)
  })
  it('Should respond 404 when no user found', async () => {
    User.findOne = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        decoded: {
          email: 'fake@email.com',
        },
      },
    } as Request

    const getDataResponse = await getDataHandler(User, req, mockRes)
    expect(getDataResponse.sendStatus).toHaveBeenCalledWith(404)
  })
  it('Should respond 401 when email is empty', async () => {
    const req = {
      body: {
        decoded: {
          email: '',
        },
      },
    } as Request

    const getDataResponse = await getDataHandler(User, req, mockRes)
    expect(getDataResponse.sendStatus).toHaveBeenCalledWith(401)
  })
  it('Should respond 401 when email is not defined', async () => {
    const req = {
      body: {
        decoded: {},
      },
    } as Request

    const getDataResponse = await getDataHandler(User, req, mockRes)
    expect(getDataResponse.sendStatus).toHaveBeenCalledWith(401)
  })
})
