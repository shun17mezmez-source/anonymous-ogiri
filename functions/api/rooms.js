// functions/api/rooms.js

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

function makeCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const code = (url.searchParams.get("code") || "")
      .trim()
      .toUpperCase();

    if (!code) {
      return json({ error: "ルームコードが必要です。" }, 400);
    }

    const room = await context.env.DB.prepare(`
      SELECT
        id,
        code,
        question,
        duration_seconds,
        deadline,
        max_answers,
        created_at
      FROM rooms
      WHERE code = ?
    `)
      .bind(code)
      .first();

    if (!room) {
      return json({ error: "ルームが見つかりません。" }, 404);
    }

    const players = await context.env.DB.prepare(`
      SELECT id, name, created_at
      FROM players
      WHERE room_id = ?
      ORDER BY created_at ASC
    `)
      .bind(room.id)
      .all();

    return json({
      room,
      players: players.results || [],
      ended: Date.now() >= room.deadline,
    });
  } catch (error) {
    console.error(error);
    return json({ error: "ルーム情報の取得に失敗しました。" }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const question = String(body.question || "").trim();
    const playerName =
      String(body.playerName || "プレイヤー").trim().slice(0, 30) ||
      "プレイヤー";

    const durationSeconds = Number(body.durationSeconds);
    const maxAnswers = Number(body.maxAnswers);

    if (!question) {
      return json({ error: "お題が必要です。" }, 400);
    }

    if (
      !Number.isFinite(durationSeconds) ||
      durationSeconds < 60 ||
      durationSeconds > 60 * 60 * 24 * 5
    ) {
      return json({ error: "開催期間が正しくありません。" }, 400);
    }

    if (
      !Number.isInteger(maxAnswers) ||
      maxAnswers < 1 ||
      maxAnswers > 3
    ) {
      return json({ error: "回答数は1〜3にしてください。" }, 400);
    }

    const roomId = crypto.randomUUID();
    const playerId = crypto.randomUUID();
    const now = Date.now();
    const deadline = now + durationSeconds * 1000;

    let code = "";

    for (let i = 0; i < 10; i++) {
      const candidate = makeCode();

      const exists = await context.env.DB.prepare(`
        SELECT id
        FROM rooms
        WHERE code = ?
      `)
        .bind(candidate)
        .first();

      if (!exists) {
        code = candidate;
        break;
      }
    }

    if (!code) {
      return json({ error: "ルームコードの生成に失敗しました。" }, 500);
    }

    await context.env.DB.batch([
      context.env.DB.prepare(`
        INSERT INTO rooms (
          id,
          code,
          question,
          duration_seconds,
          deadline,
          max_answers,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        roomId,
        code,
        question,
        durationSeconds,
        deadline,
        maxAnswers,
        now
      ),

      context.env.DB.prepare(`
        INSERT INTO players (
          id,
          room_id,
          name,
          created_at
        )
        VALUES (?, ?, ?, ?)
      `).bind(
        playerId,
        roomId,
        playerName,
        now
      ),
    ]);

    return json(
      {
        room: {
          id: roomId,
          code,
          question,
          duration_seconds: durationSeconds,
          deadline,
          max_answers: maxAnswers,
          created_at: now,
        },
        player: {
          id: playerId,
          name: playerName,
        },
      },
      201
    );
  } catch (error) {
    console.error(error);
    return json({ error: "ルーム作成に失敗しました。" }, 500);
  }
}