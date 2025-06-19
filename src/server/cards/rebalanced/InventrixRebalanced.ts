import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Inventrix} from '../corporation/Inventrix';
import {IPlayer} from '../../../server/IPlayer';
import {ICard} from '../ICard';
import {Resource} from '../../../common/Resource';
import {RequirementType} from '../../../common/cards/RequirementType';
import {requirementType} from '../../../common/cards/CardRequirementDescriptor';
import {Size} from '../../../common/cards/render/Size';

const GLOBAL_REQUIREMENT_MODIFIER = 2;

const stepValues = {
  venus: 2,
  oxygen: 1,
  temperature: 2,
  oceans: 1,
};

const paramKeyMap: Partial<Record<RequirementType, keyof typeof stepValues>> = {
  [RequirementType.TEMPERATURE]: 'temperature',
  [RequirementType.OXYGEN]: 'oxygen',
  [RequirementType.OCEANS]: 'oceans',
  [RequirementType.VENUS]: 'venus',
};

export class InventrixRebalanced extends Inventrix {
  constructor() {
    super({
      name: CardName.INVENTRIX_REBALANCED,
      globalParameterRequirementBonus: {steps: GLOBAL_REQUIREMENT_MODIFIER},

      metadata: {
        cardNumber: 'RB-CORP-10',
        description: 'As your first action in the game, draw 3 cards. Start with 45 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.megacredits(45).nbsp.cards(3);
          b.corpBox('effect', (ce) => {
            ce.vSpace(Size.LARGE);
            ce.effect('Your temperature, oxygen, ocean, and Venus requirements are +2 or -2 steps, your choice in each case.', (eb) => {
              eb.plate('Global requirements').startEffect.text('+/- 2');
            });
            ce.effect('When you use the global requirement modifier to play a card, gain 3 M€.', (eb) => {
              eb.cards(1).plate('Global requirements').asterix().startEffect.megacredits(3);
            });
          });
        }),
      },
    });
  }

  public revertParam(
    currentValue: number,
    stepBoost: number | undefined,
    paramKey: keyof typeof stepValues,
  ): number {
    return currentValue - (stepBoost ?? 0) * stepValues[paramKey];
  }

  private getRawGlobalValue(type: RequirementType, player: IPlayer): number {
    switch (type) {
    case RequirementType.TEMPERATURE: return player.game.getTemperature();
    case RequirementType.OXYGEN: return player.game.getOxygenLevel();
    case RequirementType.OCEANS: return player.game.board.getOceanSpaces().length;
    case RequirementType.VENUS: return player.game.getVenusScaleLevel();
    default: return 0;
    }
  }

  public onCardPlayed(player: IPlayer, card: ICard): void {
    if (!player.isCorporation(this.name)) return;
    if (!card.requirements) return;

    const descriptor = Array.isArray(card.requirements) ? card.requirements[0] : card.requirements;
    if (!descriptor) return;

    const type = requirementType(descriptor);
    const paramKey = paramKeyMap[type];
    if (!paramKey) return;

    const rawValue = descriptor[paramKey as keyof typeof descriptor];
    if (typeof rawValue !== 'number') return;

    const requiredValue = rawValue;
    const stepBoost = paramKey !== 'oceans' ? card.behavior?.global?.[paramKey] : undefined;

    const rawParam = this.getRawGlobalValue(type, player);
    const actualValue = this.revertParam(rawParam, stepBoost, paramKey);

    const needReward = !descriptor.max ?
      actualValue < requiredValue :
      actualValue > requiredValue;
    if (!needReward) return;

    player.stock.add(Resource.MEGACREDITS, 3, {log: false});
    player.game.log(
      '${0} gained 3 M€ from ${1} effect. Parameter: ' + paramKey + ', Current: ${2}, Required: ${3}.',
      (b) => b.player(player).card(this).number(actualValue).number(requiredValue),
    );
  }
}
