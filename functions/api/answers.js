const VOTING_TIME_MS = 5 * 60 * 1000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

async function getRoom(DB, roomId) {
  return await DB.prepare(`
    SELECT
      id,
      deadline,
      max_answers
    FROM rooms
    WHERE id = ?
  `)
    .bind(roomId)
    .first();
}

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

async function startVotingPhase(DB, roomId, now = Date.now()) {
  const votingDeadline =
    now + VOTING_TIME_MS;

  await DB.prepare(`
    INSERT OR IGNORE INTO voting_phases (
      room_id,
      started_at,
      deadline
    )
    VALUES (?, ?, ?)
  `)
    .bind(
      roomId,
      now,
      votingDeadline
    )
    .run();

  return await getVotingPhase(
    DB,
    roomId
  );
}

async function getPhase(DB, room) {
  const now = Date.now();

  let votingPhase =
    await getVotingPhase(
      DB,
      room.id
    );

  /*
    回答時間そのものが終了していた場合も
    自動的に投票タイムへ移行する
  */
  if (
    !votingPhase &&
    now >= Number(room.deadline)
  ) {
    votingPhase =
      await startVotingPhase(
        DB,
        room.id,
        now
      );
  }

  if (votingPhase) {
    if (
      now >=
      Number(votingPhase.deadline)
    ) {
      return {
        phase: "finished",
        votingStartedAt:
          Number(
            votingPhase.started_at
          ),
        votingDeadline:
          Number(
            votingPhase.deadline
          )
      };
    }

    return {
      phase: "voting",
      votingStartedAt:
        Number(
          votingPhase.started_at
        ),
      votingDeadline:
        Number(
          votingPhase.deadline
        )
    };
  }

  return {
    phase: "answering",
    votingStartedAt: null,
    votingDeadline: null
  };
}

export async function onRequestGet(
  context
) {
  try {
    const url =
      new URL(
        context.request.url
      );

    const roomId =
      String(
        url.searchParams.get(
          "roomId"
        ) || ""
      ).trim();

    if (!roomId) {
      return json(
        {
          error:
            "ルーム情報が不足しています。"
        },
        400
      );
    }

    const room =
      await getRoom(
        context.env.DB,
        roomId
      );

    if (!room) {
      return json(
        {
          error:
            "ルームが見つかりません。"
        },
        404
      );
    }

    const phaseInfo =
      await getPhase(
        context.env.DB,
        room
      );

    const answers =
      await context.env.DB.prepare(`
        SELECT
          answers.id,
          answers.room_id,
          answers.player_id,
          answers.text,
          answers.created_at,
          COUNT(votes.id) AS vote_count
        FROM answers
        LEFT JOIN votes
          ON votes.answer_id =
             answers.id
        WHERE
          answers.room_id = ?
        GROUP BY
          answers.id,
          answers.room_id,
          answers.player_id,
          answers.text,
          answers.created_at
        ORDER BY
          answers.created_at ASC
      `)
        .bind(roomId)
        .all();

    return json({
      answers:
        answers.results || [],

      phase:
        phaseInfo.phase,

      answering:
        phaseInfo.phase ===
        "answering",

      voting:
        phaseInfo.phase ===
        "voting",

      ended:
        phaseInfo.phase ===
        "finished",

      votingStartedAt:
        phaseInfo.votingStartedAt,

      votingDeadline:
        phaseInfo.votingDeadline
    });

  } catch (error) {
    console.error(error);

    return json(
      {
        error:
          "回答の取得に失敗しました。"
      },
      500
    );
  }
}

export async function onRequestPost(
  context
) {
  try {
    const body =
      await context.request.json();

    const roomId =
      String(
        body.roomId || ""
      ).trim();

    const playerId =
      String(
        body.playerId || ""
      ).trim();

    const text =
      String(
        body.text || ""
      )
        .trim()
        .slice(0, 100);

    if (
      !roomId ||
      !playerId ||
      !text
    ) {
      return json(
        {
          error:
            "回答情報が不足しています。"
        },
        400
      );
    }

    const room =
      await getRoom(
        context.env.DB,
        roomId
      );

    if (!room) {
      return json(
        {
          error:
            "ルームが見つかりません。"
        },
        404
      );
    }

    /*
      すでに投票タイムなら
      回答はできない
    */
    let votingPhase =
      await getVotingPhase(
        context.env.DB,
        roomId
      );

    /*
      回答時間切れ
      ↓
      5分間の投票タイム開始
    */
    if (
      !votingPhase &&
      Date.now() >=
        Number(room.deadline)
    ) {
      votingPhase =
        await startVotingPhase(
          context.env.DB,
          roomId
        );
    }

    if (votingPhase) {
      return json(
        {
          error:
            "回答受付は終了しています。投票タイムです。"
        },
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
        {
          error:
            "参加者情報が見つかりません。"
        },
        403
      );
    }

    const maxAnswers =
      Number(
        room.max_answers || 3
      );

    const answerCount =
      await context.env.DB.prepare(`
        SELECT
          COUNT(*) AS count
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
      Number(
        answerCount?.count || 0
      );

    if (
      currentCount >=
      maxAnswers
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
      まだ回答枠が残っている
      プレイヤーが何人いるか確認
    */
    const remainingPlayers =
      await context.env.DB.prepare(`
        SELECT
          COUNT(*) AS count
        FROM players AS p
        WHERE
          p.room_id = ?
          AND (
            SELECT COUNT(*)
            FROM answers AS a
            WHERE
              a.room_id =
                p.room_id
              AND a.player_id =
                p.id
          ) < ?
      `)
        .bind(
          roomId,
          maxAnswers
        )
        .first();

    const remaining =
      Number(
        remainingPlayers?.count ||
          0
      );

    let phase =
      "answering";

    let votingStartedAt =
      null;

    let votingDeadline =
      null;

    /*
      全員が回答権を
      使い切った
      ↓
      投票タイム開始
    */
    if (remaining === 0) {
      const newVotingPhase =
        await startVotingPhase(
          context.env.DB,
          roomId,
          now
        );

      phase =
        "voting";

      votingStartedAt =
        Number(
          newVotingPhase.started_at
        );

      votingDeadline =
        Number(
          newVotingPhase.deadline
        );
    }

    return json(
      {
        success: true,

        answer: {
          id: answerId,
          room_id: roomId,
          player_id: playerId,
          text,
          created_at: now
        },

        phase,
        votingStartedAt,
        votingDeadline
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