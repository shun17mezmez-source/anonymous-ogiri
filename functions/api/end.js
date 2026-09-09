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

    const roomId = String(body.roomId || "");
    const playerId = String(body.playerId || "");

    if (!roomId || !playerId) {
      return json(
        { error: "ルーム情報が不足しています。" },
        400
      );
    }

    const room = await context.env.DB.prepare(`
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
        { error: "ルームが見つかりません。" },
        404
      );
    }

    if (room.host_player_id !== playerId) {
      return json(
        { error: "ルーム作成者だけが終了できます。" },
        403
      );
    }

    const now = Date.now();

    await context.env.DB.prepare(`
      UPDATE rooms
      SET deadline = ?
      WHERE id = ?
    `)
      .bind(now, roomId)
      .run();

    return json({
      success: true,
      deadline: now,
    });
  } catch (error) {
    console.error(error);

    return json(
      { error: "終了処理に失敗しました。" },
      500
    );
  }
}