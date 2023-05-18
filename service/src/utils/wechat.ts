import fetch from 'node-fetch'

export async function fetchWeChatId (code: string) {
    const url = `https://wechat.sharegpt.vip/api/wechat/user?code=${code}`
    const response = await fetch(url, {
        headers:  {
            Authorization: 'KQ0dsrvHUxEHFdLEEfLk'
        }
    })
    return response
}

export function fetchWeChatCodeUrl (redirectUrl: string, scope: string) {
    const url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${process.env.WECHAT_APP_ID}&redirect_uri=${redirectUrl}&response_type=code&scope=${scope}&state=STATE#wechat_redirect`
    return url
}

export async function fetchAccessToken(code: string) {
    const url = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${process.env.WECHAT_APP_ID}&secret=${process.env.WECHAT_APP_SECRET}&code=${code}&grant_type=authorization_code`
    const response = await fetch(url)
    const data = await response.json()
    return data
}

export async function fetchUserInfo (access_token: string, openid: string) {
    const url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
    const response = await fetch(url)
    const data = await response.json()
    return data
}