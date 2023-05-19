import type { ObjectId } from 'mongodb'
import type { TextAuditServiceOptions, TextAuditServiceProvider } from 'src/utils/textAudit'

export enum Status {
  Normal = 0,
  Deleted = 1,
  InversionDeleted = 2,
  ResponseDeleted = 3,
  PreVerify = 4,
  AdminVerify = 5,
}

export enum LimitPeriod {
  Forever = -1,
  Day = 0,
  Week = 1,
  Month = 2,
}

// user chats limits in the specified time period
export class ChatLimits {
  dayOfPeriod?: number
  createTime: Date
  updateTime?: Date
  constructor(
    public limits: number,
    public period: LimitPeriod
  ) {
    this.createTime = new Date()
    // By period type, got dayOfPeriod from createTime
    if (period === LimitPeriod.Week) {
      this.dayOfPeriod = this.createTime.getDay()
    } else if (period === LimitPeriod.Month) {
      // got the day of month from createTime
      this.dayOfPeriod = this.createTime.getDate()
    } else {
      this.dayOfPeriod = undefined
    }

    this.updateTime = new Date()
  }
}

export class UserInfo {
  _id: ObjectId
  name: string
  email?: string
  password?: string
  oauth_provider?: string
  oauth_uid?: string
  oauth_token?: string
  wechat_unionid?: string
  status: Status
  createTime: Date
  verifyTime?: string
  avatar?: string
  description?: string
  updateTime?: Date
  chatLimits?: ChatLimits
  constructor(b: Partial<UserInfo> = {}) {
    Object.assign(this, b)

    this.createTime = new Date()
    this.verifyTime = null
    this.updateTime = new Date()
    this.chatLimits = new ChatLimits(+process.env.CHAT_LIMIT_DEFAULT_CHAT_COUNT, +process.env.CHAT_LIMIT_DEFAULT_PERIOD as LimitPeriod)
  }
}
export class ChatRoom {
  _id: ObjectId
  roomId: number
  userId: string
  title: string
  prompt: string
  status: Status = Status.Normal
  constructor(userId: string, title: string, roomId: number) {
    this.userId = userId
    this.title = title
    this.prompt = undefined
    this.roomId = roomId
  }
}

export class ChatOptions {
  parentMessageId?: string
  messageId?: string
  conversationId?: string
  promptTokens?: number
  completionTokens?: number
  totalTokens?: number
  estimated?: boolean
  constructor(parentMessageId?: string, messageId?: string, conversationId?: string) {
    this.parentMessageId = parentMessageId
    this.messageId = messageId
    this.conversationId = conversationId
  }
}

export class previousResponse {
  response: string
  options: ChatOptions
}

export class ChatInfo {
  _id: ObjectId
  roomId: number
  uuid: number
  dateTime: Date
  prompt: string
  response?: string
  status: Status = Status.Normal
  options: ChatOptions
  previousResponse?: previousResponse[]
  constructor(roomId: number, uuid: number, prompt: string, options: ChatOptions) {
    this.roomId = roomId
    this.uuid = uuid
    this.prompt = prompt
    this.options = options
    this.dateTime = new Date()
  }
}

export class UsageResponse {
  prompt_tokens: number
  completion_tokens: number
  total_tokens: number
  estimated: boolean
}

export class ChatUsage {
  _id: ObjectId
  userId: ObjectId
  roomId: number
  chatId: ObjectId
  messageId: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  estimated: boolean
  dateTime: Date
  constructor(userId: ObjectId, roomId: number, chatId: ObjectId, messageId: string, usage: UsageResponse) {
    this.userId = userId
    this.roomId = roomId
    this.chatId = chatId
    this.messageId = messageId
    if (usage) {
      this.promptTokens = usage.prompt_tokens
      this.completionTokens = usage.completion_tokens
      this.totalTokens = usage.total_tokens
      this.estimated = usage.estimated
    }
    this.dateTime = new Date()
  }
}

export class Config {
  constructor(
    public _id: ObjectId,
    public timeoutMs: number,
    public apiKey?: string,
    public apiDisableDebug?: boolean,
    public accessToken?: string,
    public apiBaseUrl?: string,
    public apiModel?: string,
    public chatModel?: string,
    public reverseProxy?: string,
    public socksProxy?: string,
    public socksAuth?: string,
    public httpsProxy?: string,
    public siteConfig?: SiteConfig,
    public mailConfig?: MailConfig,
    public auditConfig?: AuditConfig,
  ) { }
}

export class SiteConfig {
  constructor(
    public siteTitle?: string,
    public loginEnabled?: boolean,
    public loginSalt?: string,
    public registerEnabled?: boolean,
    public registerReview?: boolean,
    public registerMails?: string,
    public siteDomain?: string,
  ) { }
}

export class MailConfig {
  constructor(
    public smtpHost: string,
    public smtpPort: number,
    public smtpTsl: boolean,
    public smtpUserName: string,
    public smtpPassword: string,
  ) { }
}

export class AuditConfig {
  constructor(
    public enabled: boolean,
    public provider: TextAuditServiceProvider,
    public options: TextAuditServiceOptions,
    public textType: TextAudioType,
    public customizeEnabled: boolean,
    public sensitiveWords: string,
  ) { }
}

export enum TextAudioType {
  None = 0,
  Request = 1 << 0, // 二进制 01
  Response = 1 << 1, // 二进制 10
  All = Request | Response, // 二进制 11
}
