// functions/api/join.js

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const code = String(body.code || "")
      .trim()
      .toUpperCase();

    const name =
      String(body.name || "プレイヤー").trim().slice(0, 30) ||
      "プレイヤー";

    if (!code) {
      return json({ error: "ルームコードを入力してください。" }, 400);
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

    const playerId = crypto.randomUUID();
    const now = Date.now();

    await context.env.DB.prepare(`
      INSERT INTO players (
        id,
        room_id,
        name,
        created_at
      )
      VALUES (?, ?, ?, ?)
    `)
      .bind(
        playerId,
        room.id,
        name,
        now
      )
      .run();

    return json(
      {
        room,
        player: {
          id: playerId,
          name,
        },
        ended: now >= room.deadline,
      },
      201
    );
  } catch (error) {
    console.error(error);
    return json({ error: "ルーム参加に失敗しました。" }, 500);
  }
}