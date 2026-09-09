// functions/api/votes.js

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
    const playerId = url.searchParams.get("playerId");

    if (!roomId || !playerId) {
      return json({ error: "roomIdとplayerIdが必要です。" }, 400);
    }

    const vote = await context.env.DB.prepare(`
      SELECT
        id,
        answer_id,
        created_at
      FROM votes
      WHERE room_id = ?
        AND player_id = ?
    `)
      .bind(roomId, playerId)
      .first();

    return json({
      vote: vote || null,
    });
  } catch (error) {
    console.error(error);
    return json({ error: "投票情報の取得に失敗しました。" }, 500);
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const roomId = String(body.roomId || "");
    const answerId = String(body.answerId || "");
    const playerId = String(body.playerId || "");

    if (!roomId || !answerId || !playerId) {
      return json({ error: "投票情報が不足しています。" }, 400);
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

    if (Date.now() >= room.deadline) {
      return json({ error: "投票受付は終了しています。" }, 403);
    }

    const voter = await context.env.DB.prepare(`
      SELECT id
      FROM players
      WHERE id = ?
        AND room_id = ?
    `)
      .bind(playerId, roomId)
      .first();

    if (!voter) {
      return json({ error: "参加者情報が正しくありません。" }, 403);
    }

    const answer = await context.env.DB.prepare(`
      SELECT
        id,
        player_id
      FROM answers
      WHERE id = ?
        AND room_id = ?
    `)
      .bind(answerId, roomId)
      .first();

    if (!answer) {
      return json({ error: "回答が見つかりません。" }, 404);
    }

    if (answer.player_id === playerId) {
      return json({ error: "自分の回答には投票できません。" }, 403);
    }

    const alreadyVoted = await context.env.DB.prepare(`
      SELECT id, answer_id
      FROM votes
      WHERE room_id = ?
        AND player_id = ?
    `)
      .bind(roomId, playerId)
      .first();

    if (alreadyVoted) {
      return json(
        {
          error: "投票できるのは1人1票までです。",
          answerId: alreadyVoted.answer_id,
        },
        409
      );
    }

    const id = crypto.randomUUID();
    const now = Date.now();

    try {
      await context.env.DB.prepare(`
        INSERT INTO votes (
          id,
          room_id,
          answer_id,
          player_id,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
      `)
        .bind(
          id,
          roomId,
          answerId,
          playerId,
          now
        )
        .run();
    } catch (error) {
      if (
        String(error).includes("UNIQUE") ||
        String(error).includes("unique")
      ) {
        return json(
          { error: "投票できるのは1人1票までです。" },
          409
        );
      }

      throw error;
    }

    return json(
      {
        success: true,
        vote: {
          id,
          room_id: roomId,
          answer_id: answerId,
          player_id: playerId,
          created_at: now,
        },
      },
      201
    );
  } catch (error) {
    console.error(error);
    return json({ error: "投票に失敗しました。" }, 500);
  }
}