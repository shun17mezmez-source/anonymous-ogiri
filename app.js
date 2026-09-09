const QUESTIONS = [
  "こんなコンビニは嫌だ",
  "絶対に乗りたくないタクシーとは？",
  "こんな学校は嫌だ",
  "未来のコンビニにありそうなもの",
  "こんなゲームはすぐサービス終了する",
  "宇宙人が地球に来て最初に言った一言",
  "絶対に売れない新商品とは？",
  "こんな遊園地は嫌だ",
  "社長が朝礼で言ったら不安になる一言",
  "こんなAIは信用できない",
  "100年後の学校では当たり前になっていること",
  "絶対に泊まりたくないホテルの特徴",
  "このラーメン屋、何かがおかしい。なぜ？",
  "世界一やる気のないヒーローの決めゼリフ",
  "絶対にバズらないSNSの新機能とは？",
  "こんなスマホは3日で返品する",
  "未来の自動販売機にありそうな謎の商品",
  "校長先生が突然発表した衝撃の新校則",
  "絶対に採用してはいけない新人の自己PR",
  "世界一どうでもいいギネス記録とは？",
  "こんな結婚式は途中で帰りたい",
  "この医者、大丈夫か？と思った一言",
  "絶対に入りたくない部活の名前",
  "人気ゼロのYouTuber、そのチャンネル名とは？",
  "新しく追加された意味不明な祝日とは？",
  "絶対に怖くないホラー映画のタイトル",
  "世界一弱そうな必殺技の名前",
  "こんなロボットはいらない",
  "未来の教科書に載っていた意外な人物",
  "絶対に使いたくない翻訳アプリの特徴",
  "このスーパー、普通じゃない。何があった？",
  "神様がうっかり人間に送ってしまった通知",
  "桃太郎が鬼ヶ島に行くのをやめた理由",
  "浦島太郎が現代に来て最初に驚いたこと",
  "シンデレラのガラスの靴が売れなかった理由",
  "世界一適当な占い師が言いそうなこと",
  "絶対に信用できない天気予報",
  "こんな先生の授業は受けたくない",
  "この会社、今日で辞めよう。何があった？",
  "面接官を困らせた衝撃の志望動機",
  "絶対に誰も来ないテーマパークの新アトラクション",
  "世界一客が少ないカフェの特徴",
  "こんな美容院は二度と行かない",
  "絶対に嫌な目覚まし時計の新機能",
  "最新AIに絶対覚えさせてはいけないこと",
  "AIが人類に初めてついたしょうもない嘘",
  "ロボットがストライキを始めた理由",
  "100年後にもなぜか残っていたもの",
  "未来人が現代を見て爆笑した理由",
  "タイムマシンのレビュー★1、その理由は？",
  "宇宙旅行で絶対に聞きたくないアナウンス",
  "宇宙人が地球人を見て勘違いしたこと",
  "月に初めてできたコンビニの人気商品",
  "世界征服に失敗したあまりにも情けない理由",
  "魔王が勇者に本気で謝った理由",
  "勇者が冒険開始5分で帰宅した理由",
  "ラスボスなのに全然怖くない。なぜ？",
  "RPGに追加された誰も得しない新システム",
  "絶対に課金したくないソシャゲの新ガチャ",
  "ゲーム史上最弱の武器、その名前と特徴",
  "絶対に売れないゲームのタイトル",
  "SNSで一度も『いいね』されなかった投稿とは？",
  "フォロワー0人なのに炎上した。なぜ？",
  "絶対に使いたくないSNSの新機能",
  "インフルエンサーが一瞬でフォロワーを失った投稿",
  "世界一しょうもない炎上理由",
  "こんなマッチングアプリは嫌だ",
  "初デートで言われたら帰りたくなる一言",
  "絶対にモテない人のプロフィール文",
  "告白した瞬間に全部台無しになった一言",
  "世界一ロマンチックじゃないプロポーズ",
  "犬が突然しゃべれるようになって最初に言ったこと",
  "猫が人間にずっと隠していた秘密",
  "動物園の新入り、明らかに動物じゃない。何？",
  "世界一自由すぎるペットの特徴",
  "こんな動物病院は嫌だ",
  "無人島に持っていったら一番役に立たないもの",
  "遭難中なのに全員が笑った理由",
  "世界一雑なサバイバル術",
  "宝箱を開けた勇者がそっと閉じた理由",
  "伝説の剣が誰にも抜かれなかった本当の理由",
  "世界一いらない超能力とは？",
  "透明人間になったのに全然嬉しくない理由",
  "ヒーローが絶対に人前で使いたくない必殺技",
  "悪の組織の福利厚生にありそうなもの",
  "怪獣が東京を襲うのをやめた理由",
  "幽霊が逆に人間を怖がった理由",
  "幽霊屋敷のレビュー★5に書かれていたこと",
  "ゾンビが人間を追いかけるのをやめた理由",
  "吸血鬼が現代社会で困っていること",
  "絶対に怖くない怪談のオチ",
  "世界一平和な悪口とは？",
  "絶対に怒られない遅刻の言い訳",
  "誰も反論できなかった謎の言い訳",
  "『それ今言う？』何と言った？",
  "一瞬で場の空気が変わった一言",
  "全員が『知らんがな』と思った重大発表",
  "ニュース速報で流すほどではないニュース",
  "歴史の教科書に載せるほどではない出来事",
  "国民全員が困惑した新しい法律",
  "世界一しょうもない国際問題とは？",
  "絶対に行きたくない温泉旅館のサービス",
  "このレストラン、注文する前に帰りたい。なぜ？",
  "100万円もらってもやりたくないアルバイト",
  "絶対に流行らない新スポーツとは？",
  "世界一静かなライブで起きたこと",
  "こんな電車はすぐ降りたい",
  "絶対に使いたくないカーナビの案内",
  "この空港、何かがおかしい。なぜ？",
  "世界一頼りない警察官の一言",
  "新入社員が初日に会社を伝説にした理由",
  "絶対に買いたくない福袋の中身",
  "サンタクロースが今年だけ来なかった理由",
  "世界一夢のない宝くじの1等賞品",
  "無人島にコンビニができた。最初に売れたものは？",
  "学校の七不思議に追加されたしょうもない8つ目",
  "絶対に参加したくない運動会の新種目",
  "修学旅行が開始10分で中止になった理由",
  "卒業式で校長が放った衝撃の一言",
  "こんな給食は嫌だ",
  "テストに出たら先生を疑う問題とは？",
  "世界一意味のない宿題とは？",
  "絶対に受けたくないオンライン授業",
  "新しい教科『○○』何を勉強する？"
];

const state = {
  screen: "home",
  room: null,
  me: null,
  answers: [],
  myVotes: {},
  phase: "answering",
  votingDeadline: null,
  loading: false,
  votingAnswerId: null,
  refreshTimer: null,
  tickTimer: null,
  reloading: false
};

const app = document.querySelector("#app");

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

const randomQuestion = () =>
  QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

const fmt = (ms) => {
  let s = Math.max(0, Math.ceil(ms / 1000));

  const d = Math.floor(s / 86400);
  s %= 86400;

  const h = Math.floor(s / 3600);
  s %= 3600;

  const m = Math.floor(s / 60);
  const r = s % 60;

  if (d > 0) {
    return `${d}日 ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
};

async function api(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  let data = {};

  try {
    data = await response.json();
  } catch {}

  if (!response.ok) {
    throw new Error(data.error || "通信に失敗しました。");
  }

  return data;
}

function saveSession() {
  localStorage.setItem(
    "anonymousOgiriSession",
    JSON.stringify({
      room: state.room,
      me: state.me
    })
  );
}

function clearSession() {
  localStorage.removeItem("anonymousOgiriSession");
}

function loadSession() {
  try {
    const raw = localStorage.getItem("anonymousOgiriSession");

    if (!raw) return false;

    const data = JSON.parse(raw);

    if (!data.room?.code || !data.me?.id) {
      return false;
    }

    state.room = data.room;
    state.me = data.me;

    return true;
  } catch {
    return false;
  }
}

function stopRefresh() {
  if (state.refreshTimer) {
    clearInterval(state.refreshTimer);
    state.refreshTimer = null;
  }
}

function startRefresh() {
  stopRefresh();

  state.refreshTimer = setInterval(() => {
    if (state.screen === "game") {
      refreshGame(false);
    }
  }, 3000);
}

function stopTick() {
  if (state.tickTimer) {
    clearTimeout(state.tickTimer);
    state.tickTimer = null;
  }
}

function reloadAtDeadline() {
  if (state.reloading) return;

  state.reloading = true;

  stopRefresh();
  stopTick();

  location.reload();
}

function go(screen) {
  stopRefresh();
  stopTick();

  state.screen = screen;
  render();
}

function backHome() {
  stopRefresh();
  stopTick();

  state.screen = "home";
  render();
}

async function returnToRoom() {
  if (!state.room?.id || !state.me?.id) {
    return;
  }

  state.screen = "game";

  await refreshGame(false);

  render();
}

function render() {
  stopTick();

  if (state.screen === "home") {
    home();
  } else if (state.screen === "create") {
    createRoom();
  } else if (state.screen === "join") {
    joinRoom();
  } else if (state.screen === "game") {
    game();
  } else if (state.screen === "result") {
    result();
  }
}

function home() {
  stopRefresh();

  const hasRoom = Boolean(
    state.room?.id &&
    state.me?.id
  );

  app.innerHTML = `
    <div class="wrap">

      <div class="card hero">

        <div class="logo">
          🎤 匿名大喜利
        </div>

        <p class="sub">
          匿名で答えて、
          みんなの👍を勝ち取ろう。
        </p>

        ${
          hasRoom
            ? `
              <button
                class="btn full"
                onclick="returnToRoom()"
              >
                参加中のルームに戻る
              </button>

              <div class="notice">
                ルームコード：
                <strong>${esc(state.room.code)}</strong>
              </div>
            `
            : ""
        }

        <button
          class="btn ${hasRoom ? "secondary" : ""} full"
          onclick="go('create')"
        >
          ルームを作る
        </button>

        <button
          class="btn secondary full"
          onclick="go('join')"
        >
          ルームに参加する
        </button>

        ${
          hasRoom
            ? `
              <button
                class="btn secondary full"
                onclick="leaveRoom()"
              >
                今のルームから退出
              </button>
            `
            : ""
        }

      </div>

    </div>
  `;
}

function createRoom() {
  stopRefresh();

  const firstQuestion = randomQuestion();

  app.innerHTML = `
    <div class="wrap">

      <div class="nav">
        <strong>
          ルーム作成
        </strong>

        <button
          class="btn secondary"
          onclick="go('home')"
        >
          戻る
        </button>
      </div>

      <div class="card">

        <div class="label">
          お題
        </div>

        <input
          id="customQuestion"
          class="input"
          maxlength="100"
          value="${esc(firstQuestion)}"
          placeholder="お題を入力"
        >

        <button
          type="button"
          class="btn secondary full"
          onclick="redrawRandomQuestion()"
          style="margin-top:10px"
        >
          🎲 お題を引き直す
        </button>

        <div class="notice">
          ランダムお題は何回でも引き直せます。
          自分で好きなお題に書き換えてもOKです。
        </div>

        <div class="label">
          回答時間
        </div>

        <select
          id="duration"
          class="input"
        >
          <option value="3600">1時間</option>
          <option value="21600">6時間</option>
          <option value="43200">12時間</option>
          <option value="86400">1日</option>
          <option value="259200">3日</option>
          <option value="432000" selected>5日</option>
        </select>

        <div class="label">
          1人の回答数
        </div>

        <select
          id="maxAnswers"
          class="input"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="0" selected>無制限</option>
        </select>

        <button
          id="createButton"
          class="btn full"
          onclick="create()"
        >
          ルームを作成
        </button>

        <div id="err"></div>

      </div>

    </div>
  `;
}

function redrawRandomQuestion() {
  const input =
    document.getElementById("customQuestion");

  if (!input) {
    return;
  }

  let nextQuestion = randomQuestion();

  /*
    同じお題を連続で引きにくくする
  */
  if (
    QUESTIONS.length > 1 &&
    nextQuestion === input.value
  ) {
    while (
      nextQuestion === input.value
    ) {
      nextQuestion = randomQuestion();
    }
  }

  input.value = nextQuestion;

  input.focus();
}

function joinRoom() {
  stopRefresh();

  app.innerHTML = `
    <div class="wrap">

      <div class="nav">
        <strong>
          ルーム参加
        </strong>

        <button
          class="btn secondary"
          onclick="go('home')"
        >
          戻る
        </button>
      </div>

      <div class="card">

        <div class="label">
          ルームコード
        </div>

        <input
          id="code"
          class="input"
          maxlength="6"
          placeholder="例：AB12CD"
          autocomplete="off"
        >

        <button
          id="joinButton"
          class="btn full"
          onclick="join()"
        >
          参加する
        </button>

        <div id="err"></div>

      </div>

    </div>
  `;
}

function game() {
  if (!state.room || !state.me) {
    go("home");
    return;
  }

  if (state.phase === "finished") {
    state.screen = "result";
    render();
    return;
  }

  const mine =
    state.answers.filter(
      (answer) =>
        answer.player_id === state.me.id
    );

  const isHost =
    state.room.host_player_id ===
    state.me.id;

  if (state.phase === "voting") {
    votingScreen(isHost);
    return;
  }

  answeringScreen(
    mine,
    isHost
  );
}

function answeringScreen(
  mine,
  isHost
) {
  const left = Math.max(
    0,
    Number(state.room.deadline) -
      Date.now()
  );

  const maxAnswers =
    Number(state.room.max_answers);

  const unlimited =
    maxAnswers === 0;

  const reachedLimit =
    !unlimited &&
    mine.length >= maxAnswers;

  const answerStatus =
    unlimited
      ? `${mine.length}回答 / 無制限`
      : `${mine.length}/${maxAnswers}回答`;

  app.innerHTML = `
    <div class="wrap">

      <div class="nav">

        <strong>
          回答受付中
        </strong>

        <span class="badge">
          ${answerStatus}
        </span>

      </div>

      <div class="card">

        <div
          class="timer"
          id="timer"
        >
          ${fmt(left)}
        </div>

        <div class="question">
          「${esc(state.room.question)}」
        </div>

        <div class="notice">
          ルームコード：
          <strong>${esc(state.room.code)}</strong>
        </div>

        <div class="notice">
           好きな回答に👍できます。
           同じ回答には1人10回まで👍できます。
        </div>

        <input
          id="answer"
          class="input"
          maxlength="100"
          placeholder="回答を入力してください"
          ${
            reachedLimit
              ? "disabled"
              : ""
          }
        >

        <button
          class="btn full"
          onclick="submitAnswer()"
          ${
            reachedLimit
              ? "disabled"
              : ""
          }
        >
          ${
            reachedLimit
              ? "回答済み"
              : "回答する"
          }
        </button>

        ${
          isHost
            ? `
              <button
                class="btn secondary full"
                onclick="endAnsweringEarly()"
                style="margin-top:12px"
              >
                回答受付を終了して投票へ
              </button>
            `
            : ""
        }

        <button
          class="btn secondary full"
          onclick="backHome()"
          style="margin-top:12px"
        >
          ホームへ戻る
        </button>

        <div id="err"></div>

      </div>

      <div class="card">

        <div class="sectionTitle">
          みんなの回答
        </div>

        ${
          state.answers.length
            ? state.answers
                .map(interactiveAnswerHTML)
                .join("")
            : `
              <p class="muted">
                まだ回答がありません。
              </p>
            `
        }

      </div>

    </div>
  `;

  startRefresh();
  tickAnswering();
}

function votingScreen(isHost) {
  const left = Math.max(
    0,
    Number(
      state.votingDeadline || 0
    ) - Date.now()
  );

  app.innerHTML = `
    <div class="wrap">

      <div class="nav">

        <strong>
          👍 投票タイム
        </strong>

        <span class="badge">
          投票受付中
        </span>

      </div>

      <div class="card">

        <div
          class="timer"
          id="timer"
        >
          ${fmt(left)}
        </div>

        <div class="question">
          「${esc(state.room.question)}」
        </div>

        <div class="notice">
          好きな回答に👍してください。
          同じ回答には1人10票まで投票できます。
        </div>

        <div class="notice">
          回答期間中につけた👍もそのまま引き継がれます。
        </div>

        ${
          isHost
            ? `
              <button
                class="btn full"
                onclick="endVotingEarly()"
                style="margin-top:12px"
              >
                投票を終了して結果発表
              </button>
            `
            : ""
        }

        <button
          class="btn secondary full"
          onclick="backHome()"
          style="margin-top:12px"
        >
          ホームへ戻る
        </button>

      </div>

      <div class="card">

        <div class="sectionTitle">
          回答一覧
        </div>

        ${
          state.answers.length
            ? state.answers
                .map(interactiveAnswerHTML)
                .join("")
            : `
              <p class="muted">
                回答がありません。
              </p>
            `
        }

      </div>

    </div>
  `;

  startRefresh();
  tickVoting();
}

function interactiveAnswerHTML(answer) {
  const mine =
    answer.player_id ===
    state.me.id;

  const myVoteCount =
    Number(
      state.myVotes[
        answer.id
      ] || 0
    );

  const reachedLimit =
    myVoteCount >= 10;

  const sending =
    state.votingAnswerId ===
    answer.id;

  return `
    <div class="answer">

      <div class="answerText">
        ${esc(answer.text)}
      </div>

      ${
        mine
          ? `
            <div class="answerMeta">
              あなたの回答
            </div>
          `
          : ""
      }

      <div class="voteRow">

        ${
          mine
            ? `
              <button
                class="btn"
                disabled
              >
                自分の回答
              </button>
            `
            : `
              <button
                class="btn"
                onclick="castVote('${answer.id}')"
                ${
                  reachedLimit ||
                  sending
                    ? "disabled"
                    : ""
                }
              >
                ${
                  sending
                    ? "👍..."
                    : reachedLimit
                      ? "👍 上限"
                      : "👍"
                }
              </button>
            `
        }

      </div>

    </div>
  `;
}

function result() {
  stopRefresh();
  stopTick();

  const top5 =
    [...state.answers]
      .sort(
        (a, b) =>
          Number(
            b.vote_count || 0
          ) -
          Number(
            a.vote_count || 0
          )
      )
      .slice(0, 5);

  app.innerHTML = `
    <div class="wrap">

      <div
        class="card"
        style="text-align:center"
      >

        <div style="font-size:42px">
          🏆
        </div>

        <h1>
          結果発表
        </h1>

        <p class="muted">
          「${esc(state.room?.question || "")}」
        </p>

        <p class="muted">
          TOP5
        </p>

      </div>

      <div class="card">

        ${
          top5.length
            ? top5
                .map(
                  (
                    answer,
                    index
                  ) => `
                    <div class="answer">

                      <div class="rank">
                        ${
                          [
                            "🥇",
                            "🥈",
                            "🥉"
                          ][index] ||
                          `${index + 1}位`
                        }
                      </div>

                      <div class="answerText">
                        ${esc(answer.text)}
                      </div>

                    </div>
                  `
                )
                .join("")
            : `
              <p class="muted">
                回答がありません。
              </p>
            `
        }

        <button
          class="btn secondary full"
          onclick="backHome()"
        >
          ホームへ戻る
        </button>

        <button
          class="btn secondary full"
          onclick="leaveRoom()"
          style="margin-top:12px"
        >
          このルームから退出
        </button>

      </div>

    </div>
  `;
}

async function create() {
  if (state.loading) {
    return;
  }

  const button =
    document.getElementById(
      "createButton"
    );

  const err =
    document.getElementById(
      "err"
    );

  const customQuestion =
    document
      .getElementById(
        "customQuestion"
      )
      .value
      .trim();

  const durationSeconds =
    Number(
      document.getElementById(
        "duration"
      ).value
    );

  const maxAnswers =
    Number(
      document.getElementById(
        "maxAnswers"
      ).value
    );

  if (!customQuestion) {
    err.innerHTML = `
      <div class="error">
        お題を入力してください。
      </div>
    `;

    return;
  }

  state.loading = true;

  button.disabled = true;
  button.textContent = "作成中...";
  err.innerHTML = "";

  try {
    const data =
      await api(
        "/api/rooms",
        {
          method: "POST",

          body:
            JSON.stringify({
              question:
                customQuestion,

              durationSeconds,
              maxAnswers
            })
        }
      );

    state.room =
      data.room;

    state.me =
      data.player;

    state.answers = [];
    state.myVotes = {};
    state.phase = "answering";
    state.votingDeadline = null;
    state.votingAnswerId = null;
    state.reloading = false;

    saveSession();

    state.screen = "game";

    await refreshGame(false);

    render();
  } catch (error) {
    err.innerHTML = `
      <div class="error">
        ${esc(error.message)}
      </div>
    `;

    button.disabled = false;
    button.textContent =
      "ルームを作成";
  } finally {
    state.loading = false;
  }
}

async function join() {
  if (state.loading) {
    return;
  }

  const button =
    document.getElementById(
      "joinButton"
    );

  const err =
    document.getElementById(
      "err"
    );

  const code =
    document
      .getElementById("code")
      .value
      .trim()
      .toUpperCase();

  if (!code) {
    err.innerHTML = `
      <div class="error">
        ルームコードを入力してください。
      </div>
    `;

    return;
  }

  state.loading = true;

  button.disabled = true;
  button.textContent =
    "参加中...";
  err.innerHTML = "";

  try {
    const data =
      await api(
        "/api/join",
        {
          method: "POST",

          body:
            JSON.stringify({
              code,
              name: "匿名"
            })
        }
      );

    state.room =
      data.room;

    state.me =
      data.player;

    state.answers = [];
    state.myVotes = {};
    state.phase = "answering";
    state.votingDeadline = null;
    state.votingAnswerId = null;
    state.reloading = false;

    saveSession();

    state.screen = "game";

    await refreshGame(false);

    render();
  } catch (error) {
    err.innerHTML = `
      <div class="error">
        ${esc(error.message)}
      </div>
    `;

    button.disabled = false;
    button.textContent =
      "参加する";
  } finally {
    state.loading = false;
  }
}

async function submitAnswer() {
  if (
    state.loading ||
    state.phase !== "answering"
  ) {
    return;
  }

  const input =
    document.getElementById(
      "answer"
    );

  const err =
    document.getElementById(
      "err"
    );

  if (!input || !err) {
    return;
  }

  const text =
    input.value.trim();

  if (!text) {
    err.innerHTML = `
      <div class="error">
        回答を入力してください。
      </div>
    `;

    return;
  }

  state.loading = true;
  err.innerHTML = "";

  try {
    await api(
      "/api/answers",
      {
        method: "POST",

        body:
          JSON.stringify({
            roomId:
              state.room.id,

            playerId:
              state.me.id,

            text
          })
      }
    );

    input.value = "";

    await refreshGame(false);

    render();
  } catch (error) {
    err.innerHTML = `
      <div class="error">
        ${esc(error.message)}
      </div>
    `;
  } finally {
    state.loading = false;
  }
}

async function castVote(answerId) {
  if (
    state.phase === "finished" ||
    state.votingAnswerId
  ) {
    return;
  }

  const current =
    Number(
      state.myVotes[
        answerId
      ] || 0
    );

  if (current >= 10) {
    return;
  }

  state.votingAnswerId =
    answerId;

  render();

  try {
    const data =
      await api(
        "/api/votes",
        {
          method: "POST",

          body:
            JSON.stringify({
              roomId:
                state.room.id,

              answerId,

              playerId:
                state.me.id
            })
        }
      );

    state.myVotes[
      answerId
    ] =
      Number(
        data.myVoteCount ??
          current + 1
      );
  } catch (error) {
    alert(error.message);
  } finally {
    state.votingAnswerId =
      null;

    render();
  }
}

async function refreshGame(
  shouldRender = true
) {
  if (
    !state.room?.id ||
    !state.me?.id
  ) {
    return;
  }

  try {
    const previousPhase =
      state.phase;

    const [
      answersData,
      votesData
    ] =
      await Promise.all([
        api(
          `/api/answers?roomId=${encodeURIComponent(
            state.room.id
          )}`
        ),

        api(
          `/api/votes?roomId=${encodeURIComponent(
            state.room.id
          )}&playerId=${encodeURIComponent(
            state.me.id
          )}`
        )
      ]);

    state.answers =
      answersData.answers || [];

    state.myVotes =
      votesData.myVotes || {};

    state.phase =
      answersData.phase ||
      votesData.phase ||
      "answering";

    state.votingDeadline =
      answersData.votingDeadline ||
      votesData.votingDeadline ||
      null;

    if (
      state.phase ===
      "finished"
    ) {
      state.screen =
        "result";

      stopRefresh();
      stopTick();
    } else {
      state.screen =
        "game";
    }

    const phaseChanged =
      previousPhase !==
      state.phase;

    if (
      shouldRender ||
      phaseChanged
    ) {
      render();
    }
  } catch (error) {
    console.error(error);
  }
}

async function restoreSession() {
  if (!loadSession()) {
    render();
    return;
  }

  try {
    const data =
      await api(
        `/api/rooms?code=${encodeURIComponent(
          state.room.code
        )}`
      );

    state.room =
      data.room;

    state.screen =
      "game";

    state.reloading =
      false;

    await refreshGame(false);

    saveSession();
  } catch (error) {
    console.error(error);

    clearSession();

    state.room = null;
    state.me = null;
    state.answers = [];
    state.myVotes = {};
    state.phase = "answering";
    state.votingDeadline = null;
    state.votingAnswerId = null;
    state.reloading = false;
    state.screen = "home";
  }

  render();
}

async function endAnsweringEarly() {
  if (
    !state.room ||
    !state.me ||
    state.phase !== "answering"
  ) {
    return;
  }

  if (
    state.room.host_player_id !==
    state.me.id
  ) {
    alert(
      "ルーム作成者だけが操作できます。"
    );

    return;
  }

  const ok =
    confirm(
      "回答受付を終了して投票タイムに移りますか？"
    );

  if (!ok || state.loading) {
    return;
  }

  state.loading = true;

  try {
    const data =
      await api(
        "/api/end",
        {
          method: "POST",

          body:
            JSON.stringify({
              roomId:
                state.room.id,

              playerId:
                state.me.id
            })
        }
      );

    state.phase =
      data.phase ||
      "voting";

    state.votingDeadline =
      data.votingDeadline ||
      null;

    await refreshGame(false);

    render();
  } catch (error) {
    alert(
      error.message ||
        "終了処理に失敗しました。"
    );
  } finally {
    state.loading = false;
  }
}

async function endVotingEarly() {
  if (
    !state.room ||
    !state.me ||
    state.phase !== "voting"
  ) {
    return;
  }

  if (
    state.room.host_player_id !==
    state.me.id
  ) {
    alert(
      "ルーム作成者だけが操作できます。"
    );

    return;
  }

  const ok =
    confirm(
      "投票を終了して結果発表に移りますか？"
    );

  if (!ok || state.loading) {
    return;
  }

  state.loading = true;

  try {
    const data =
      await api(
        "/api/end",
        {
          method: "POST",

          body:
            JSON.stringify({
              roomId:
                state.room.id,

              playerId:
                state.me.id
            })
        }
      );

    state.phase =
      data.phase ||
      "finished";

    state.votingDeadline =
      data.votingDeadline ||
      state.votingDeadline;

    await refreshGame(false);

    render();
  } catch (error) {
    alert(
      error.message ||
        "投票終了処理に失敗しました。"
    );
  } finally {
    state.loading = false;
  }
}

function leaveRoom() {
  stopRefresh();
  stopTick();

  clearSession();

  state.room = null;
  state.me = null;
  state.answers = [];
  state.myVotes = {};
  state.phase = "answering";
  state.votingDeadline = null;
  state.votingAnswerId = null;
  state.reloading = false;
  state.screen = "home";

  render();
}

function tickAnswering() {
  stopTick();

  const el =
    document.getElementById(
      "timer"
    );

  if (
    !el ||
    !state.room ||
    state.phase !== "answering"
  ) {
    return;
  }

  const left =
    Math.max(
      0,
      Number(
        state.room.deadline
      ) -
        Date.now()
    );

  el.textContent =
    fmt(left);

  if (left <= 0) {
    reloadAtDeadline();
    return;
  }

  state.tickTimer =
    setTimeout(
      tickAnswering,
      1000
    );
}

function tickVoting() {
  stopTick();

  const el =
    document.getElementById(
      "timer"
    );

  if (
    !el ||
    state.phase !== "voting"
  ) {
    return;
  }

  const left =
    Math.max(
      0,
      Number(
        state.votingDeadline || 0
      ) -
        Date.now()
    );

  el.textContent =
    fmt(left);

  if (left <= 0) {
    reloadAtDeadline();
    return;
  }

  state.tickTimer =
    setTimeout(
      tickVoting,
      1000
    );
}

restoreSession();