interface OengusMarathon {
  /** @example 'rtaijs2022' */
  id: string;
  /** @example 'RTA in Japan Summer 2022' */
  name: string;
  creator: OengusUser;
  startDate: string;
  endDate: string;
  submissionsStartDate: string;
  submissionsEndDate: string;
  description: string;
  /** true: オフ開催 */
  onsite: boolean;
  location: string;
  language: string;
  maxGamesPerRunner: number;
  maxCategoriesPerGame: number;
  hasMultiplayer: boolean;
  maxNumberOfScreens: number;
  twitch: string;
  twitter: string;
  discord: string;
  country: string;
  discordPrivacy: boolean;
  submitsOpen: boolean;
  /** @example 'PT10M' */
  defaultSetupTime: string;
  selectionDone: boolean;
  scheduleDone: boolean;
  donationsOpen: boolean;
  isPrivate: boolean;
  videoRequired: true;
  unlimitedGames: boolean;
  unlimitedCategories: boolean;
  emulatorAuthorized: boolean;
  moderators: OengusUser[];
  hasIncentives: boolean;
  canEditSubmissions: true;
  questions: {
    id: number;
    label: string;
    fieldType: 'CHECKBOX' | 'FREETEXT';
    required: boolean;
    options: [];
    questionType: 'SUBMISSION';
    description: string | null;
    position: number;
  }[];
  hasDonations: boolean;
  payee: null;
  supportedCharity: null;
  donationCurrency: null;
  webhook: null;
  youtube: string;
  discordGuildId: string;
  discordGuildName: string;
  discordRequired: boolean;
  announceAcceptedSubmissions: boolean;
  userInfoHidden: null;
  donationsTotal: null;
  hasSubmitted: boolean;
}

type OengusAnswers = OengusAnswer[];
type OengusAnswer = {
  id: number;
  questionId: number;
  submissionId: number;
  answer: string | null;
};

type OengusSubmissions = {
  content: OengusSubmission[];
  totalPages: number;
  currentPage: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

type OengusSubmission = {
  id: number;
  games: OengusGame[];
  user: OengusUser;
};

type OengusGame = {
  id: number;
  /** @example 'ゲーム名' */
  name: string;
  /** @example 'ゲームの説明だよ' */
  description: string;
  /** @example 'Wii' */
  console: string;
  /** @example '4:3' */
  ratio: string;
  emulated: boolean;
  /** カテゴリ */
  categories: Category[];
};

type Category = {
  /** カテゴリID */
  id: number;
  /** カテゴリ名 */
  name: string;
  /**
   * 予定時刻
   * @description PTの後に時、分が続く。
   * @example "PT47M"
   * @example "PT1H"
   * @example "PT4H30M"
   */
  estimate: string;
  /** カテゴリ説明 */
  description: string;
  /** 動画URL */
  video: string;
  /** シングルかレースか */
  type: CategoryType;
  /** レース用のコード。シングルならnull */
  code: string;
  /** たぶんレース相手の動画情報 */
  opponents: {
    /** レース参加者ID(ユーザIDではない) */
    id: number;
    /** 動画URL */
    video: string;
  }[];
  /** (不明)たぶんレース相手のなにか */
  opponentDtos: {
    /** レース参加者ID(ユーザIDではない) */
    id: number;
    /** ユーザ情報 */
    user: OengusUser;
    /** 動画URL */
    video: string;
    /** 参加可能時刻 */
    availabilities: {
      from: string;
      to: string;
    }[];
  }[];
};

type CategoryType = 'SINGLE' | 'RACE' | 'COOP' | 'COOP_RACE';

type OengusUser = {
  id: number;
  username: string;
  /** 日本語表示名 */
  usernameJapanese: string;
  enabled: boolean;
  pronouns: [];
  /** @example 'JP' */
  country: string;
  languagesSpoken: [''];
  /** @example ['ROLE_USER'] */
  roles: string[];
  /** 他サービスと接続したアカウント */
  connections: OengusUserconnections[];
};

type OengusUserconnections = {
  id: number;
  platform: 'DISCORD' | 'SPEEDRUNCOM' | 'TWITCH' | 'TWITTER';
  username: string;
};

type OengusSelection = {
  [selectionId: number]: {
    categoryId: number;
    id: number;
    status: string;
  };
};

type OengusAvailabilities = {
  [username: string]: {
    /** @example '2022-08-11T03:00:00Z' */
    from: string;
    /** @example '2022-08-11T16:00:00Z' */
    to: string;
    username: string;
    usernameJapanese: string;
  }[];
};

type OengusSchedules = {
  id: number;
  lines: OengusSchedule[];
};

type OengusSchedule = {
  categoryId: number;
  /** @example 'Any%' */
  categoryName: string;
  /** @example 'SFC' */
  console: string;
  customDataDTO: null;
  customRun: boolean;
  /** @example '2021-12-26T03:00:00Z' */
  date: string;
  emulated: boolean;
  /** @exmaple 'PT3H' */
  estimate: string;
  /** @example 'クロノトリガー' */
  gameName: string;
  id: number;
  position: 0;
  /** @example '16:9' */
  ratio: string;
  runners: OengusUser[];
  setupBlock: boolean;
  setupBlockText: string | null;
  /** @example 'PT8M' */
  setupTime: string;
  type: CategoryType;
};
