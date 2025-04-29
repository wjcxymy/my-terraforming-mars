import {Message} from '../logs/Message';
import {Units} from '../Units';
import {CardName} from '../cards/CardName';
import {Resource} from '../Resource';
import {CardDiscount} from '../cards/Types';
import {Tag} from '../cards/Tag';
import {Warning} from '../cards/Warning';

export interface CardModel {
    name: CardName;
    resources: number | undefined;
    calculatedCost?: number;
    isSelfReplicatingRobotsCard?: boolean,
    isInfiniteMonkeyTheoremCard?: boolean,
    discount?: Array<CardDiscount>,
    isDisabled?: boolean; // Used with Pharmacy Union
    warning?: string | Message;
    warnings?: ReadonlyArray<Warning>;
    reserveUnits?: Readonly<Units>; // Written for The Moon, but useful in other contexts.
    bonusResource?: Array<Resource>; // Used with the Mining cards and Robotic Workforce
    cloneTag?: Tag; // Used with Pathfinders
    lastProjectCardCost?: number; // 专用于《LunaChain》: 记录上一张项目牌打出的实际支付 M€,会在前端渲染时显示在卡牌角落。
    currentWorldline?: number; // 专用于《世界线航行者》: 记录当前所处世界线状态，用于控制前端渲染时的图片显示。
}
