import fs from 'fs-extra';
import fetch from 'node-fetch';

const getOengusMd = async (marathonId: string, token: string): Promise<OengusMarathon> => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`https://oengus.io/api/v1/marathons/${marathonId}`, options);
  const json = (await res.json()) as OengusMarathon;
  return json;
};

const getOengusAnswers = async (marathonId: string, token: string): Promise<OengusAnswers> => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`https://oengus.io/api/v1/marathons/${marathonId}/submissions/answers`, options);
  const json = (await res.json()) as OengusAnswers;
  return json;
};

const getOengusSubmissions = async (marathonId: string, token: string): Promise<OengusSubmissions> => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`https://oengus.io/api/v1/marathons/${marathonId}/submissions`, options);
  const json = (await res.json()) as OengusSubmissions;
  return json;
};

const getOengusmSelection = async (marathonId: string, token: string): Promise<OengusSelection> => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`https://oengus.io/api/v1/marathons/${marathonId}/selections?status=`, options);
  const json = (await res.json()) as OengusSelection;
  return json;
};

const RETRY_MAX = 3;
let retry = RETRY_MAX;
const getOengusmAvailabilities = async (marathonId: string, userId: number, token: string): Promise<OengusAvailabilities> => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`https://oengus.io/api/v1/marathons/${marathonId}/submissions/availabilities/${userId}`, options);
  const json = (await res.json()) as OengusAvailabilities;
  // 普通はkeyが1個(username)だけなので、それ以外の場合はリトライする
  if (Object.keys(json).length >= 2) {
    if (retry > 0) {
      console.log(`何かおかしいのでリトライします userId= ${userId}`);
      console.log(json);
      await sleep(500);
      retry--;
      return getOengusmAvailabilities(marathonId, userId, token);
    } else {
      console.log('リトライ超過');
      retry = RETRY_MAX;
      return {};
    }
  } else {
    retry = RETRY_MAX;
    return json;
  }
};

const getOengusSchedule = async (marathonId: string, token: string): Promise<OengusSchedules> => {
  const options = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
  const res = await fetch(`https://oengus.io/api/v1/marathons/${marathonId}/schedule`, options);
  const json = (await res.json()) as OengusSchedules;
  return json;
};

const saveJson = (filepath: string, json: any) => {
  fs.outputFileSync(filepath, JSON.stringify(json, null, '  '));
};
const saveTxt = (filepath: string, json: any) => {
  fs.outputFileSync(filepath, json);
};

const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));

const start = async () => {
  const id = '★marathon id★';
  const token = '★Oengus トークン★';

  // md
  console.log(`イベント情報を取得: ${id}`);
  const mdjson = await getOengusMd(id, token);
  saveJson(`${id}/marathon.json`, mdjson);
  saveTxt(`${id}/README.md`, mdjson.description);

  // submissions
  console.log(`応募情報を取得`);
  const submissions = await getOengusSubmissions(id, token);
  saveJson(`${id}/submissions.json`, submissions);

  // answers
  try {
    console.log(`応募の回答を取得`);
    const answers = await getOengusAnswers(id, token);
    saveJson(`${id}/answers.json`, answers);
  } catch (e) {
    console.log(e);
    console.log('エラー。読み取り専用になってるやつかも？');
  }

  // 全ユーザの一覧を取得
  console.log(`ユーザの一覧を取得`);
  let userIdList: number[] = [];
  for (const submission of submissions) {
    // 走者
    const userId = submission.user.id;
    userIdList.push(userId);

    // 並走
    submission.games.map((game) => {
      game.categories.map((category) => {
        category.opponentDtos.map((opponent) => {
          const user = opponent.user.id;
          userIdList.push(user);
        });
      });
    });
  }
  userIdList = Array.from(new Set(userIdList));

  try {
    console.log(`参加可能日時を取得`);
    let availabilitiesList: OengusAvailabilities = {};
    const len = userIdList.length;
    for (let i = 0; i < len; i++) {
      console.log(`${i + 1}/${len}`);
      const userId = userIdList[i];
      const availabilities = await getOengusmAvailabilities(id, userId, token);
      availabilitiesList = { ...availabilitiesList, ...availabilities };
    }
    saveJson(`${id}/availabilities.json`, availabilitiesList);
  } catch (e) {
    console.log(e);
    console.log('エラー。読み取り専用になってるやつかも？');
  }

  // selection
  console.log(`選考状態を取得`);
  const selection = await getOengusmSelection(id, token);
  saveJson(`${id}/selection.json`, selection);

  // schedule
  try {
    console.log('スケジュールを取得');
    const schedule = await getOengusSchedule(id, token);
    saveJson(`${id}/schedule.json`, schedule);
  } catch (e) {
    console.log(e);
  }
};

start();
