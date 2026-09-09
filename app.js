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
  "こんなAIは信用できない"
];

const state = {
  screen: "home",
  room: null,
  me: null,
  answers: [],
  myVote: null,
  loading: false,
  refreshTimer: null
};

const app = document.querySelector("#app");

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[c])
  );

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
    return `${d}日 ${String(h).padStart(2, "0")}:${String(m).padStart(
      2,
      "0"
    )}`;
  }

  return `${String(h).padStart(2, "0")}:${String(m).padStart(
    2,
    "0"
  )}:${String(r).padStart(2, "0")}`;
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

    if (!raw) {
      return false;
    }

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

function go(screen) {
  stopRefresh();
  state.screen = screen;
  render();
}

function render() {
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
  app.innerHTML = `
    <div class="wrap">

      <div class="card hero">

        <div class="logo">
          🎤 匿名大喜利
        </div>

        <p class="sub">
          匿名で答えて、みんなの1票を勝ち取ろう。
        </p>

        <button
          class="btn full"
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

      </div>

    </div>
  `;
}

function createRoom() {
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
          あなたの名前
        </div>

        <input
          id="playerName"
          class="input"
          maxlength="30"
          placeholder="プレイヤー1"
          value="プレイヤー1"
        >

        <div class="label">
          開催期間
        </div>

        <select
          id="duration"
          class="input"
        >

          <option value="3600">
            1時間
          </option>

          <option value="21600">
            6時間
          </option>

          <option value="43200">
            12時間
          </option>

          <option value="86400">
            1日
          </option>

          <option value="259200">
            3日
          </option>

          <option value="432000" selected>
            5日
          </option>

        </select>

        <div class="label">
          1人の回答数
        </div>

        <select
          id="maxAnswers"
          class="input"
        >

          <option value="1">
            1
          </option>

          <option value="2">
            2
          </option>

          <option value="3" selected>
            3
          </option>

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

function joinRoom() {
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
          あなたの名前
        </div>

        <input
          id="playerName"
          class="input"
          maxlength="30"
          placeholder="プレイヤー"
        >

        <div class="label">
          ルームコード
        </div>

        <input
          id="code"
          class="input"
          maxlength="6"
          placeholder="例：AB12CD"
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

  const left = Math.max(
    0,
    Number(state.room.deadline) - Date.now()
  );

  if (left <= 0) {
    state.screen = "result";
    render();
    return;
  }

  const mine = state.answers.filter(
    (answer) => answer.player_id === state.me.id
  );

  const isHost =
    state.room.host_player_id === state.me.id;

  app.innerHTML = `
    <div class="wrap">

      <div class="nav">

        <strong>
          開催中
        </strong>

        <span class="badge">
          ${mine.length}/${state.room.max_answers}回答
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
          <strong>
            ${esc(state.room.code)}
          </strong>
        </div>

        <div class="notice">
          回答受付中です。投稿された回答は下に表示され、
          開催期間中いつでも投票できます。
        </div>

        <input
          id="answer"
          class="input"
          maxlength="100"
          placeholder="回答を入力してください"
          ${
            mine.length >= state.room.max_answers
              ? "disabled"
              : ""
          }
        >

        <button
          class="btn full"
          onclick="submitAnswer()"
          ${
            mine.length >= state.room.max_answers
              ? "disabled"
              : ""
          }
        >
          回答する
        </button>

        ${
          isHost
            ? `
              <button
                class="btn secondary full"
                onclick="endGameEarly()"
                style="margin-top:12px"
              >
                このお題を途中で終了する
              </button>
            `
            : ""
        }

        <div id="err"></div>

      </div>

      <div class="card">

        <div class="sectionTitle">
          みんなの回答
        </div>

        <div id="answersArea">

          ${
            state.answers.length
              ? state.answers.map(answerHTML).join("")
              : `
                <p class="muted">
                  まだ回答がありません。
                </p>
              `
          }

        </div>

      </div>

    </div>
  `;

  tick();
  startRefresh();
}

function answerHTML(answer) {
  const mine =
    answer.player_id === state.me.id;

  const voted =
    state.myVote &&
    state.myVote.answer_id === answer.id;

  const hasVote = !!state.myVote;

  return `
    <div class="answer">

      <div class="answerText">
        ${esc(answer.text)}
      </div>

      <div class="answerMeta">
        ${
          mine
            ? "あなたの回答"
            : "匿名プレイヤー"
        }
      </div>

      <div class="voteRow">

        <span class="voteCount">
          ❤️ ${Number(answer.vote_count || 0)}票
        </span>

        <button
          class="btn"
          onclick="castVote('${answer.id}')"
          ${
            mine || hasVote
              ? "disabled"
              : ""
          }
        >
          ${
            voted
              ? "投票済み"
              : "投票する"
          }
        </button>

      </div>

    </div>
  `;
}

function result() {
  stopRefresh();

  const list = [...state.answers].sort(
    (a, b) =>
      Number(b.vote_count || 0) -
      Number(a.vote_count || 0)
  );

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
          ルームコード：
          ${esc(state.room?.code || "")}
        </p>

      </div>

      <div class="card">

        ${
          list.length
            ? list
                .map(
                  (answer, index) => `
                    <div class="answer">

                      <div class="rank">
                        ${
                          ["🥇", "🥈", "🥉"][index] ||
                          `${index + 1}位`
                        }
                      </div>

                      <div class="answerText">
                        ${esc(answer.text)}
                      </div>

                      <div class="answerMeta">
                        ❤️ ${Number(
                          answer.vote_count || 0
                        )}票
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
          onclick="leaveRoom()"
        >
          ホームへ戻る
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
    document.getElementById("createButton");

  const err =
    document.getElementById("err");

  const playerName =
    document
      .getElementById("playerName")
      .value
      .trim() ||
    "プレイヤー1";

  const durationSeconds =
    Number(
      document.getElementById("duration").value
    );

  const maxAnswers =
    Number(
      document.getElementById("maxAnswers").value
    );

  state.loading = true;

  button.disabled = true;
  button.textContent = "作成中...";

  err.innerHTML = "";

  try {
    const data = await api(
      "/api/rooms",
      {
        method: "POST",

        body: JSON.stringify({
          question: randomQuestion(),
          durationSeconds,
          maxAnswers,
          playerName
        })
      }
    );

    state.room = data.room;
    state.me = data.player;

    state.answers = [];
    state.myVote = null;

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
    button.textContent = "ルームを作成";

  } finally {
    state.loading = false;
  }
}

async function join() {
  if (state.loading) {
    return;
  }

  const button =
    document.getElementById("joinButton");

  const err =
    document.getElementById("err");

  const code =
    document
      .getElementById("code")
      .value
      .trim()
      .toUpperCase();

  const playerName =
    document
      .getElementById("playerName")
      .value
      .trim() ||
    "プレイヤー";

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
  button.textContent = "参加中...";

  err.innerHTML = "";

  try {
    const data = await api(
      "/api/join",
      {
        method: "POST",

        body: JSON.stringify({
          code,
          name: playerName
        })
      }
    );

    state.room = data.room;
    state.me = data.player;

    state.answers = [];
    state.myVote = null;

    saveSession();

    state.screen =
      data.ended
        ? "result"
        : "game";

    await refreshGame(false);

    render();

  } catch (error) {
    err.innerHTML = `
      <div class="error">
        ${esc(error.message)}
      </div>
    `;

    button.disabled = false;
    button.textContent = "参加する";

  } finally {
    state.loading = false;
  }
}

async function submitAnswer() {
  if (state.loading) {
    return;
  }

  const input =
    document.getElementById("answer");

  const err =
    document.getElementById("err");

  const text = input.value.trim();

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

        body: JSON.stringify({
          roomId: state.room.id,
          playerId: state.me.id,
          text
        })
      }
    );

    input.value = "";

    await refreshGame();

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
    state.loading ||
    state.myVote
  ) {
    return;
  }

  state.loading = true;

  try {
    await api(
      "/api/votes",
      {
        method: "POST",

        body: JSON.stringify({
          roomId: state.room.id,
          answerId,
          playerId: state.me.id
        })
      }
    );

    await refreshGame();

  } catch (error) {
    alert(error.message);

  } finally {
    state.loading = false;
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
    const [
      answersData,
      voteData
    ] = await Promise.all([
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

    state.myVote =
      voteData.vote || null;

    if (answersData.ended) {
      state.screen = "result";

      stopRefresh();

      if (shouldRender) {
        render();
      }

      return;
    }

    if (
      shouldRender &&
      state.screen === "game"
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
    const data = await api(
      `/api/rooms?code=${encodeURIComponent(
        state.room.code
      )}`
    );

    state.room = data.room;

    const [
      answersData,
      voteData
    ] = await Promise.all([
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

    state.myVote =
      voteData.vote || null;

    if (
      data.ended ||
      answersData.ended
    ) {
      state.screen = "result";
    } else {
      state.screen = "game";
    }

    saveSession();

  } catch (error) {
    console.error(error);

    clearSession();

    state.room = null;
    state.me = null;

    state.answers = [];
    state.myVote = null;

    state.screen = "home";
  }

  render();
}

async function endGameEarly() {
  if (
    !state.room ||
    !state.me
  ) {
    return;
  }

  if (
    state.room.host_player_id !==
    state.me.id
  ) {
    alert(
      "ルーム作成者だけが終了できます。"
    );

    return;
  }

  const ok = confirm(
    "このお題を途中で終了しますか？\n\n終了すると回答・投票はできなくなります。"
  );

  if (!ok) {
    return;
  }

  if (state.loading) {
    return;
  }

  state.loading = true;

  try {
    const data = await api(
      "/api/end",
      {
        method: "POST",

        body: JSON.stringify({
          roomId: state.room.id,
          playerId: state.me.id
        })
      }
    );

    state.room.deadline =
      data.deadline;

    saveSession();

    await refreshGame(false);

    state.screen = "result";

    stopRefresh();

    render();

  } catch (error) {
    console.error(error);

    alert(
      error.message ||
      "終了処理に失敗しました。"
    );

  } finally {
    state.loading = false;
  }
}

function leaveRoom() {
  stopRefresh();

  clearSession();

  state.room = null;
  state.me = null;

  state.answers = [];
  state.myVote = null;

  state.screen = "home";

  render();
}

function tick() {
  const el =
    document.getElementById("timer");

  if (
    !el ||
    !state.room
  ) {
    return;
  }

  const left = Math.max(
    0,
    Number(state.room.deadline) -
      Date.now()
  );

  el.textContent =
    fmt(left);

  if (left <= 0) {
    state.screen = "result";

    stopRefresh();

    refreshGame(false)
      .finally(() => {
        render();
      });

    return;
  }

  setTimeout(
    tick,
    1000
  );
}

restoreSession();