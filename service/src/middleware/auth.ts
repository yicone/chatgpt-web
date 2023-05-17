import jwt from 'jsonwebtoken'
import { getCacheConfig } from '../storage/config'
import { getUserById } from '../storage/mongo'
import { Status } from '../storage/model'

const auth = async (req, res, next) => {
  const config = await getCacheConfig()
  if (config.siteConfig.loginEnabled) {
    try {
      const token = req.header('Authorization').replace('Bearer ', '')
      const info = jwt.verify(token, config.siteConfig.loginSalt.trim())
      req.headers.userId = info.userId
      const user = await getUserById(info.userId)
      if (user == null)
        throw new Error('用户不存在 | User does not exist.')
      else if(user.status !== Status.Normal)
        throw new Error('用户未激活 | User is not activated.')
      else
        next()
    }
    catch (error) {
      res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
    }
  }
  else {
    // fake userid
    req.headers.userId = '6406d8c50aedd633885fa16f'
    next()
  }
}

export { auth }
