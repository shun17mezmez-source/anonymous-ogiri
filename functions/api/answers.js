const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);

    const roomId =
      String(url.searchParams.get("roomId") || "").trim();

    if (!roomId) {
      return json(
        { error: "ルーム情報が不足しています。" },
        400
      );
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
      return json(
        { error: "ルームが見つかりません。" },
        404
      );
    }

    const answers = await context.env.DB.prepare(`
      SELECT
        answers.id,
        answers.room_id,
        answers.player_id,
        answers.text,
        answers.created_at,
        COUNT(votes.id) AS vote_count
      FROM answers
      LEFT JOIN votes
        ON votes.answer_id = answers.id
      WHERE answers.room_id = ?
      GROUP BY
        answers.id,
        answers.room_id,
        answers.player_id,
        answers.text,
        answers.created_at
      ORDER BY answers.created_at ASC
    `)
      .bind(roomId)
      .all();

    return json({
      answers: answers.results || [],
      ended: Date.now() >= Number(room.deadline)
    });

  } catch (error) {
    console.error(error);

    return json(
      { error: "回答の取得に失敗しました。" },
      500
    );
  }
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const roomId =
      String(body.roomId || "").trim();

    const playerId =
      String(body.playerId || "").trim();

    const text =
      String(body.text || "")
        .trim()
        .slice(0, 100);

    if (
      !roomId ||
      !playerId ||
      !text
    ) {
      return json(
        { error: "回答情報が不足しています。" },
        400
      );
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
      return json(
        { error: "ルームが見つかりません。" },
        404
      );
    }

    if (
      Date.now() >= Number(room.deadline)
    ) {
      return json(
        { error: "この大喜利は終了しています。" },
        400
      );
    }

    const player = await context.env.DB.prepare(`
      SELECT id
      FROM players
      WHERE
        id = ?
        AND room_id = ?
    `)
      .bind(
        playerId,
        roomId
      )
      .first();

    if (!player) {
      return json(
        { error: "参加者情報が見つかりません。" },
        403
      );
    }

    const answerCount =
      await context.env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM answers
        WHERE
          room_id = ?
          AND player_id = ?
      `)
        .bind(
          roomId,
          playerId
        )
        .first();

    const currentCount =
      Number(answerCount?.count || 0);

    const maxAnswers =
      Number(room.max_answers || 3);

    if (
      currentCount >= maxAnswers
    ) {
      return json(
        {
          error:
            `回答できるのは1人${maxAnswers}回までです。`
        },
        400
      );
    }

    const answerId =
      crypto.randomUUID();

    const now =
      Date.now();

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
        answerId,
        roomId,
        playerId,
        text,
        now
      )
      .run();

    /*
      全員が回答上限まで回答したか確認
    */

    const playerCountData =
      await context.env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM players
        WHERE room_id = ?
      `)
        .bind(roomId)
        .first();

    const totalAnswerData =
      await context.env.DB.prepare(`
        SELECT COUNT(*) AS count
        FROM answers
        WHERE room_id = ?
      `)
        .bind(roomId)
        .first();

    const playerCount =
      Number(
        playerCountData?.count || 0
      );

    const totalAnswerCount =
      Number(
        totalAnswerData?.count || 0
      );

    const requiredAnswers =
      playerCount * maxAnswers;

    let ended = false;

    if (
      playerCount > 0 &&
      totalAnswerCount >= requiredAnswers
    ) {
      await context.env.DB.prepare(`
        UPDATE rooms
        SET deadline = ?
        WHERE id = ?
      `)
        .bind(
          now,
          roomId
        )
        .run();

      ended = true;
    }

    return json(
      {
        success: true,

        answer: {
          id: answerId,
          room_id: roomId,
          player_id: playerId,
          text,
          created_at: now,
          vote_count: 0
        },

        ended
      },
      201
    );

  } catch (error) {
    console.error(error);

    return json(
      {
        error:
          "回答の投稿に失敗しました。"
      },
      500
    );
  }
}