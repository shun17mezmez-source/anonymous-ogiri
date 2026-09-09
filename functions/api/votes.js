const MAX_VOTES_PER_ANSWER = 10;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

async function getVotingPhase(DB, roomId) {
  return await DB.prepare(`
    SELECT
      room_id,
      started_at,
      deadline
    FROM voting_phases
    WHERE room_id = ?
  `)
    .bind(roomId)
    .first();
}

export async function onRequestGet(context) {
  try {
    const url = new URL(context.request.url);

    const roomId =
      String(url.searchParams.get("roomId") || "").trim();

    const playerId =
      String(url.searchParams.get("playerId") || "").trim();

    if (!roomId || !playerId) {
      return json(
        { error: "投票情報が不足しています。" },
        400
      );
    }

    const votingPhase =
      await getVotingPhase(
        context.env.DB,
        roomId
      );

    const now = Date.now();

    let phase = "answering";

    if (votingPhase) {
      phase =
        now >= Number(votingPhase.deadline)
          ? "finished"
          : "voting";
    }

    const votes =
      await context.env.DB.prepare(`
        SELECT
          answer_id,
          COUNT(*) AS count
        FROM votes
        WHERE
          room_id = ?
          AND player_id = ?
        GROUP BY answer_id
      `)
        .bind(
          roomId,
          playerId
        )
        .all();

    const myVotes = {};

    for (const row of votes.results || []) {
      myVotes[row.answer_id] =
        Number(row.count || 0);
    }

    return json({
      phase,
      votingDeadline:
        votingPhase
          ? Number(votingPhase.deadline)
          : null,
      myVotes
    });

  } catch (error) {
    console.error(error);

    return json(
      { error: "投票情報の取得に失敗しました。" },
      500
    );
  }
}

export async function onRequestPost(context) {
  try {
    const body =
      await context.request.json();

    const roomId =
      String(body.roomId || "").trim();

    const answerId =
      String(body.answerId || "").trim();

    const playerId =
      String(body.playerId || "").trim();

    if (
      !roomId ||
      !answerId ||
      !playerId
    ) {
      return json(
        { error: "投票情報が不足しています。" },
        400
      );
    }

    const votingPhase =
      await getVotingPhase(
        context.env.DB,
        roomId
      );

    if (!votingPhase) {
      return json(
        { error: "まだ投票タイムではありません。" },
        400
      );
    }

    if (
      Date.now() >=
      Number(votingPhase.deadline)
    ) {
      return json(
        { error: "投票時間は終了しています。" },
        400
      );
    }

    const player =
      await context.env.DB.prepare(`
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

    const answer =
      await context.env.DB.prepare(`
        SELECT
          id,
          player_id
        FROM answers
        WHERE
          id = ?
          AND room_id = ?
      `)
        .bind(
          answerId,
          roomId
        )
        .first();

    if (!answer) {
      return json(
        { error: "回答が見つかりません。" },
        404
      );
    }

    if (
      answer.player_id === playerId
    ) {
      return json(
        { error: "自分の回答には投票できません。" },
        400
      );
    }

    const voteCount =
      await context.env.DB.prepare(`
        SELECT
          COUNT(*) AS count
        FROM votes
        WHERE
          room_id = ?
          AND player_id = ?
          AND answer_id = ?
      `)
        .bind(
          roomId,
          playerId,
          answerId
        )
        .first();

    const currentVotes =
      Number(
        voteCount?.count || 0
      );

    if (
      currentVotes >=
      MAX_VOTES_PER_ANSWER
    ) {
      return json(
        {
          error:
            `同じ回答には1人${MAX_VOTES_PER_ANSWER}票までです。`
        },
        400
      );
    }

    const voteId =
      crypto.randomUUID();

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
        voteId,
        roomId,
        answerId,
        playerId,
        Date.now()
      )
      .run();

    return json(
      {
        success: true,
        answerId,
        myVoteCount:
          currentVotes + 1
      },
      201
    );

  } catch (error) {
    console.error(error);

    return json(
      { error: "投票に失敗しました。" },
      500
    );
  }
}