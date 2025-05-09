import * as responses from '../server/responses';
import {Server} from '../models/ServerModel';
import {Handler} from './Handler';
import {Context} from './IHandler';
import {Request} from '../Request';
import {Response} from '../Response';
import {IGame} from '../IGame';
import {isGameId} from '../../common/Types';

/**
 * API 处理类：用于回退游戏状态。
 *
 * 支持通过 gameId 参数指定要回退的游戏，并使用 gameLoader 执行恢复操作。
 */
export class ApiGameRollback extends Handler {
  public static readonly INSTANCE = new ApiGameRollback();

  // 处理 POST 请求，尝试加载目标游戏并执行回退操作。
  public override async post(req: Request, res: Response, ctx: Context): Promise<void> {
    const gameId = ctx.url.searchParams.get('gameId');
    if (!gameId) {
      responses.badRequest(req, res, 'missing gameId parameter');
      return;
    }

    let game: IGame | undefined;
    if (isGameId(gameId)) {
      game = await ctx.gameLoader.getGame(gameId);
    }

    if (game === undefined) {
      responses.notFound(req, res, 'game not found');
      return;
    }

    await this.performRollback(req, res, ctx, game);
  }

  private async performRollback(_req: Request, res: Response, ctx: Context, game: IGame): Promise<void> {
    /**
     * 计算要回退到最后一个有效操作时的 lastSaveId。
     *
     * 1. 常规回退逻辑：
     * restoreGameAt() 方法在执行恢复时，并不会完全删除当前 saveId 对应的状态，
     * 而是保留一个（deleteNbrSaves 时是 (currentSaveId - saveId) - 1）。
     * 因此，即使传入 saveId = current.lastSaveId - 2，
     * 实际上只删除了 1 条记录，最终恢复后的 lastSaveId 只减少 1。
     * 这个 -2 是为了补偿这一行为，确保在调用 restoreGameAt() 后，lastSaveId 正确地回到用户期望的上一个状态。
     *
     * 2. 特殊情况：跨玩家回合时的回退逻辑。
     * 在玩家完成两次行动后，系统会自动添加一个结束回合的操作，
     * 此时 lastSaveId 会增加 3（两个玩家行动 + 一个系统自动生成的结束操作）。
     * 如果此时进行回退，lastSaveId 需要减去 2，
     * 这样实际上是跳过了系统自动生成的结束回合空操作，
     * 确保回退后只恢复有效的游戏状态，而非包括系统生成的无效操作。
     */
    const lastSaveId = game.lastSaveId - 2;
    try {
      const restoredGame = await ctx.gameLoader.restoreGameAt(game.id, lastSaveId);
      if (restoredGame === undefined) {
        game.log(
          'Unable to perform rollback operation. Error retrieving game from database. Please try again.',
          () => {},
        );
      }

      // 返回恢复后的游戏数据
      responses.writeJson(res, ctx, Server.getGameModel(restoredGame));
    } catch (err) {
      console.error(err);
    }
  }
}
