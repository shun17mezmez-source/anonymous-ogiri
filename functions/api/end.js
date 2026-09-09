const VOTING_TIME_MS = 5 * 60 * 1000;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    }
  });

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();

    const roomId =
      String(body.roomId || "").trim();

    const playerId =
      String(body.playerId || "").trim();

    if (!roomId || !playerId) {
      return json(
        {
          error:
            "ルーム情報が不足しています。"
        },
        400
      );
    }

    const room =
      await context.env.DB.prepare(`
        SELECT
          id,
          host_player_id,
          deadline
        FROM rooms
        WHERE id = ?
      `)
        .bind(roomId)
        .first();

    if (!room) {
      return json(
        {
          error:
            "ルームが見つかりません。"
        },
        404
      );
    }

    if (
      room.host_player_id !==
      playerId
    ) {
      return json(
        {
          error:
            "ルーム作成者だけが終了できます。"
        },
        403
      );
    }

    const now = Date.now();

    const votingPhase =
      await context.env.DB.prepare(`
        SELECT
          room_id,
          started_at,
          deadline
        FROM voting_phases
        WHERE room_id = ?
      `)
        .bind(roomId)
        .first();

    /*
      すでに投票タイムの場合
      ↓
      投票を強制終了
      ↓
      結果発表へ
    */
    if (votingPhase) {
      if (
        now >=
        Number(votingPhase.deadline)
      ) {
        return json({
          success: true,
          phase: "finished",
          votingDeadline:
            Number(
              votingPhase.deadline
            )
        });
      }

      await context.env.DB.prepare(`
        UPDATE voting_phases
        SET deadline = ?
        WHERE room_id = ?
      `)
        .bind(
          now,
          roomId
        )
        .run();

      return json({
        success: true,
        phase: "finished",
        votingDeadline: now
      });
    }

    /*
      まだ回答タイムの場合
      ↓
      回答を強制終了
      ↓
      5分間の投票タイム開始
    */
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

    const votingDeadline =
      now + VOTING_TIME_MS;

    await context.env.DB.prepare(`
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

    const createdPhase =
      await context.env.DB.prepare(`
        SELECT
          started_at,
          deadline
        FROM voting_phases
        WHERE room_id = ?
      `)
        .bind(roomId)
        .first();

    return json({
      success: true,
      phase: "voting",
      votingStartedAt:
        Number(
          createdPhase.started_at
        ),
      votingDeadline:
        Number(
          createdPhase.deadline
        )
    });

  } catch (error) {
    console.error(error);

    return json(
      {
        error:
          "終了処理に失敗しました。"
      },
      500
    );
  }
}