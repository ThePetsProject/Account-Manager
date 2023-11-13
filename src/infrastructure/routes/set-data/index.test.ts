import * as setDataModules from '.'
import { User, UserType } from '../../database/models/user'
import { Request, Response } from 'express'

const { setDataHandler } = setDataModules

jest.spyOn(global.console, 'error').mockImplementation(() => {})
jest.spyOn(global.console, 'info').mockImplementation(() => {})

const resMock = {
  send: jest.fn().mockReturnThis(),
  status: jest.fn().mockReturnThis(),
  sendStatus: jest.fn().mockReturnThis(),
} as any as Response

const fakeUserData = {
  email: 'fakeemail',
  name: 'fakename',
  surName: 'fakesurName',
  password: 'fakepassword',
}

const fakeUserDataNoPass = {
  email: 'fakeemail',
  name: 'fakename',
  surName: 'fakesurName',
}

describe('Login route', () => {
  beforeAll(() => {})

  beforeEach(() => {})

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should respond 200 when user data is updated', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      save: jest.fn().mockResolvedValue({}),
    })

    const req = {
      body: {
        ...fakeUserData,
      },
    } as Request

    const response = await setDataHandler(User, req, resMock)
    expect(response.status).toHaveBeenCalledWith(200)
    expect(response.send).toHaveBeenCalledWith({})
  })

  it('Should respond 404 when no user found', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce(undefined)

    const req = {
      body: {
        ...fakeUserData,
      },
    } as Request

    const response = await setDataHandler(User, req, resMock)
    expect(response.sendStatus).toHaveBeenCalledWith(404)
  })

  it('Should respond 500 when trying to save password fails', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      save: jest.fn().mockResolvedValue(undefined),
    })

    const req = {
      body: {
        ...fakeUserData,
      },
    } as Request

    const response = await setDataHandler(User, req, resMock)
    expect(response.sendStatus).toHaveBeenCalledWith(500)
  })

  it('Should respond 401 when email is empty', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      save: jest.fn().mockResolvedValue(undefined),
    })

    let emptyEmailUserData = { ...fakeUserData }
    emptyEmailUserData.email = ''
    const req = {
      body: {
        ...emptyEmailUserData,
      },
    } as Request

    const response = await setDataHandler(User, req, resMock)
    expect(response.sendStatus).toHaveBeenCalledWith(401)
  })

  it('Should respond 401 when email is not sent', async () => {
    User.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      save: jest.fn().mockResolvedValue(undefined),
    })

    let emptyEmailUserData = {
      name: 'fakename',
      surName: 'fakesurName',
      password: 'fakepassword',
    }

    const req = {
      body: {
        ...emptyEmailUserData,
      },
    } as Request

    const response = await setDataHandler(User, req, resMock)
    expect(response.sendStatus).toHaveBeenCalledWith(401)
  })
})
