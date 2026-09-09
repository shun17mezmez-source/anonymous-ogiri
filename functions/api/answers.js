// functions/api/answers.js

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
      return json({ error: "roomIdが必要です。" }, 400);
    }

    const room = await context.env.DB.prepare(`
      SELECT id, deadline
      FROM rooms
      WHERE id = ?
    `)
      .bind(roomId)
      .first();

    if (!room) {
      return json({ error: "ルームが見つかりません。" }, 404);
    }

    const result = await context.env.DB.prepare(`
      SELECT
        answers.id,
        answers.room_id,
        answers.player_id,
        answers.text,
        answers.created_at,
        players.name AS player_name,
        COUNT(votes.id) AS vote_count
      FROM answers
      JOIN players
        ON players.id = answers.player_id
      LEFT JOIN votes
        ON votes.answer_id = answers.id
      WHERE answers.room_id = ?
      GROUP BY answers.id
      ORDER BY answers.created_at DESC
    `)
      .bind(roomId)
      .all();

    return json({
      answers: result.results || [],
      ended: Date.now() >= room.deadline,
    });
  } catch (error) {
    console.error(error);
    return json({ error: "回答一覧の取得に失敗しました。" }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const roomId = String(body.roomId || "");
    const playerId = String(body.playerId || "");
    const text = String(body.text || "").trim();

    if (!roomId || !playerId) {
      return json({ error: "ルーム情報が不足しています。" }, 400);
    }

    if (!text) {
      return json({ error: "回答を入力してください。" }, 400);
    }

    if (text.length > 100) {
      return json({ error: "回答は100文字以内にしてください。" }, 400);
    }

    const room = await context.env.DB.prepare(`
      SELECT
        id,
        deadline,
        max_answers
      FROM rooms
      WHERE id = ?
    `)
      .bind(roomId)
      .first();

    if (!room) {
      return json({ error: "ルームが見つかりません。" }, 404);
    }

    if (Date.now() >= room.deadline) {
      return json({ error: "このお題は終了しています。" }, 403);
    }

    const player = await context.env.DB.prepare(`
      SELECT id
      FROM players
      WHERE id = ?
        AND room_id = ?
    `)
      .bind(playerId, roomId)
      .first();

    if (!player) {
      return json({ error: "参加者情報が正しくありません。" }, 403);
    }

    const countResult = await context.env.DB.prepare(`
      SELECT COUNT(*) AS count
      FROM answers
      WHERE room_id = ?
        AND player_id = ?
    `)
      .bind(roomId, playerId)
      .first();

    const count = Number(countResult?.count || 0);

    if (count >= room.max_answers) {
      return json(
        {
          error: `回答は1人${room.max_answers}件までです。`,
        },
        409
      );
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    await context.env.DB.prepare(`
      INSERT INTO answers (
        id,
        room_id,
        player_id,
        text,
        created_at
      )
      VALUES (?, ?, ?, ?, ?)
    `)
      .bind(
        id,
        roomId,
        playerId,
        text,
        now
      )
      .run();

    return json(
      {
        answer: {
          id,
          room_id: roomId,
          player_id: playerId,
          text,
          created_at: now,
          vote_count: 0,
        },
      },
      201
    );
  } catch (error) {
    console.error(error);
    return json({ error: "回答の投稿に失敗しました。" }, 500);
  }
}