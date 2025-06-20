export enum TraceResourceType {
  Cloudflare = 'cloudflare',
  PrimaryCentral = 'primary_central',
  SecondaryCentral = 'secondary_central',
  ReserveCentral = 'reserve_central'
}

export enum ResourceStatus {
  Loading = 'loading',
  Success = 'success',
  Failure = 'failure'
}

export enum TraceField {
  FL = 'fl',
  H = 'h',
  IP = 'ip',
  TS = 'ts',
  VISIT_SCHEME = 'visit_scheme',
  UAG = 'uag',
  COLO = 'colo',
  SLIVER = 'sliver',
  HTTP = 'http',
  LOC = 'loc',
  TLS = 'tls',
  SNI = 'sni',
  WARP = 'warp',
  GATEWAY = 'gateway',
  RBI = 'rbi',
  KEX = 'kex'
}

export interface TraceResourceMessages {
  description: string
  failure: string
  success: string
}

export interface TraceResource {
  type: TraceResourceType
  url: string
  messages: TraceResourceMessages
}

export const TRACE_RESOURCES: TraceResource[] = [
  {
    type: TraceResourceType.Cloudflare,
    url: 'https://cloudflare.com',
    messages: {
      description: 'Основной ресурс сервиса Cloudflare',
      failure: 'Инфраструктура Cloudflare заблокирована.',
      success: 'Доступ не заблокирован'
    }
  },
  {
    type: TraceResourceType.PrimaryCentral,
    url: 'https://api.scpslgame.com',
    messages: {
      description: 'Основной центральный сервер игры',
      failure: 'Основной центральный сервер игры заблокирован или временно не работает.',
      success: 'Доступ не заблокирован'
    }
  },
  {
    type: TraceResourceType.SecondaryCentral,
    url: 'https://gra1.scpslgame.com',
    messages: {
      description: 'Резервный центральный сервер игры',
      failure: 'Резервный центральный сервер заблокирован или временно не работает.',
      success: 'Доступ не заблокирован'
    }
  },
  {
    type: TraceResourceType.SecondaryCentral,
    url: 'https://gra2.scpslgame.com',
    messages: {
      description: 'Резервный центральный сервер игры',
      failure: 'Резервный центральный сервер заблокирован или временно не работает.',
      success: 'Доступ не заблокирован'
    }
  },
  {
    type: TraceResourceType.ReserveCentral,
    url: 'https://api.scpsecretlaboratory.com',
    messages: {
      description: 'Резервный центральный сервер игры для игроков из России',
      failure:
        'Резервный центральный сервер заблокирован или временно не работает. Попробуйте использовать средства для обхода блокировок.',
      success: 'Доступ не заблокирован'
    }
  }
]

export const TRACE_FIELDS: Record<TraceField, string> = {
  [TraceField.FL]: 'Экземпляр Cloudflare',
  [TraceField.H]: 'Хост',
  [TraceField.IP]: 'IP-адрес',
  [TraceField.TS]: 'Временная отметка',
  [TraceField.VISIT_SCHEME]: 'Схема',
  [TraceField.UAG]: 'User-Agent',
  [TraceField.COLO]: 'Локация',
  [TraceField.SLIVER]: 'Сегментированный запрос',
  [TraceField.HTTP]: 'Протокол',
  [TraceField.LOC]: 'Страна клиента',
  [TraceField.TLS]: 'TLS',
  [TraceField.SNI]: 'SNI',
  [TraceField.WARP]: 'WARP',
  [TraceField.GATEWAY]: 'Gateway',
  [TraceField.RBI]: 'RBI',
  [TraceField.KEX]: 'KEX'
}

export const TRACE_DESCRIPTIONS: Record<TraceField, string> = {
  [TraceField.FL]: 'Идентификатор дата-центра Cloudflare, через который прошёл запрос',
  [TraceField.H]: 'Доменное имя конечного сервера, указанное в запросе',
  [TraceField.IP]: 'IP-адрес клиента, отправившего запрос',
  [TraceField.TS]: 'Метка времени выполнения запроса в формате Unix (включая миллисекунды)',
  [TraceField.VISIT_SCHEME]: 'Протокол запроса — http или https',
  [TraceField.UAG]: 'Заголовок User-Agent, отправленный клиентом (браузером/программой)',
  [TraceField.COLO]: 'Код локации дата-центра Cloudflare',
  [TraceField.SLIVER]: 'Внутренний идентификатор сегментации запроса внутри Cloudflare',
  [TraceField.HTTP]:
    'Версия протокола HTTP, использованная в запросе\nВерсия HTTP/3 замедляется Роскомнадзором.',
  [TraceField.LOC]: 'Страна, определённая по IP клиента',
  [TraceField.TLS]:
    'Используемая версия TLS для защищённого соединения\nВерсия TLSv1.3 блокируется Роскомнадзором.',
  [TraceField.SNI]:
    'Был ли использован зашифрованный SNI (Server Name Indication)\nШифрование блокируется Роскомнадзором.',
  [TraceField.WARP]: 'Признак использования Cloudflare WARP',
  [TraceField.GATEWAY]: 'Признак прохождения запроса через Cloudflare Gateway',
  [TraceField.RBI]: 'Был ли включён режим Remote Browser Isolation (удалённый браузер)',
  [TraceField.KEX]:
    'Алгоритм обмена ключами (Key Exchange), использованный при TLS-соединении\nАлгоритм X25519MLKEM768 используется TLSv1.3 и QUIC, которые замедляются или блокируются Роскомнадзором.'
}

export const HIDDEN_TRACE_FIELDS = new Set<TraceField>([
  TraceField.FL,
  TraceField.H,
  TraceField.TS,
  TraceField.VISIT_SCHEME,
  TraceField.UAG,
  TraceField.GATEWAY,
  TraceField.RBI,
  TraceField.SLIVER,
  TraceField.LOC,
  TraceField.WARP
])
