import {expect} from 'chai';
import {StormCraftIncorporated} from '../../../src/server/cards/colonies/StormCraftIncorporated';
import {testGame} from '../../TestGame';
import {SelectAmount} from '../../../src/server/inputs/SelectAmount';
import {TestPlayer} from '../../TestPlayer';
import {cast, churn} from '../../TestingUtils';
import {getHeatForTemperature} from '../../../src/common/constants';

describe('StormCraftIncorporated', () => {
  let card: StormCraftIncorporated;
  let player: TestPlayer;

  beforeEach(() => {
    card = new StormCraftIncorporated();
    [/* game */, player] = testGame(2);
    player.corporations.push(card);
  });

  it('Should play', () => {
    cast(card.play(player), undefined);

    expect(churn(card.action(player), player)).is.undefined;

    expect(card.resourceCount).to.eq(1);
  });

  it('Restricts amounts when converting heat', () => {
    const heatRequired = getHeatForTemperature(player.game);
    player.heat = 10;
    card.resourceCount = 10;
    const options = card.spendHeat(player, heatRequired);
    expect(options.options).has.length(2);
    const heatOption = cast(options.options[0], SelectAmount);
    expect(heatOption.max).to.eq(heatRequired);
    const floaterOption = cast(options.options[1], SelectAmount);
    expect(floaterOption.max).to.eq(heatRequired / 2);
  });

  it('Validates inputs', () => {
    const heatRequired = getHeatForTemperature(player.game);
    player.heat = 10;
    card.resourceCount = 10;
    const options = card.spendHeat(player, heatRequired);
    const heatOption = cast(options.options[0], SelectAmount);
    const floaterOption = cast(options.options[1], SelectAmount);
    heatOption.cb(4);
    floaterOption.cb(0);
    expect(() => {
      options.cb(undefined);
    }).to.throw(`Need to pay ${heatRequired} heat`);
  });

  it('Converts heat with floaters and heat', () => {
    const heatRequired = getHeatForTemperature(player.game);
    player.heat = 10;
    card.resourceCount = 10;
    const options = card.spendHeat(player, heatRequired);
    const heatOption = cast(options.options[0], SelectAmount);
    const floaterOption = cast(options.options[1], SelectAmount);
    heatOption.cb(2);
    floaterOption.cb(3);
    options.cb(undefined);
    expect(player.heat).to.eq(8);
    expect(card.resourceCount).to.eq(7);
  });
});
