import { Request } from 'express'
import { validateJWT } from '.'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

const mockNext = jest.fn()
process.env.JWT_MANAGER_URL = 'FAKE_JWT_MANAGER_URL'
process.env.JWT_MANAGER_VALIDATE_PATH = 'FAKE_JWT_MANAGER_VALIDATE_PATH'

describe('Validate JWT MDW', () => {
  it('Should return 200 when JWT is valid', async () => {
    mockedAxios.request.mockResolvedValue({ data: { email: 'fake@email.com' } })

    const mockReq = {
      headers: {
        authorization: 'Bearer fakeJWT',
      },
    } as Request

    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    } as any
    const validateJWTResponse = await validateJWT(mockReq, mockRes, mockNext)
    expect(mockNext).toBeCalled()
    expect(mockReq.body).toEqual(
      expect.objectContaining({
        decoded: {
          email: 'fake@email.com',
        },
      })
    )
  })
  it('Should return 401 when no bearer present', async () => {
    mockedAxios.request.mockResolvedValue({ data: { email: 'fake@email.com' } })

    const mockReq = {
      headers: {},
    } as Request

    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    } as any
    const validateJWTResponse = await validateJWT(mockReq, mockRes, mockNext)
    expect(typeof validateJWTResponse).toBe('object')
    expect(
      validateJWTResponse['sendStatus' as keyof typeof validateJWTResponse]
    ).toBeCalledWith(401)
  })

  it('Should return 401 when JWT is not valid', async () => {
    mockedAxios.request.mockRejectedValueOnce({})

    const mockReq = {
      headers: {
        authorization: 'Bearer fakeJWT',
      },
    } as Request

    const mockRes = {
      send: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis(),
    } as any
    const validateJWTResponse = await validateJWT(mockReq, mockRes, mockNext)
    expect(typeof validateJWTResponse).toBe('object')
    expect(
      validateJWTResponse['sendStatus' as keyof typeof validateJWTResponse]
    ).toBeCalledWith(401)
  })
})
