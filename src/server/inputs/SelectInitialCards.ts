import * as titles from '../../common/inputs/SelectInitialCards';
import {ICorporationCard} from '../cards/corporation/ICorporationCard';
import {IPlayer} from '../IPlayer';
import {SelectCard} from './SelectCard';
import {Merger} from '../cards/promo/Merger';
import {CardName} from '../../common/cards/CardName';
import {SelectInitialCardsModel} from '../../common/models/PlayerInputModel';
import {InputError} from './InputError';
import {OptionsInput} from './OptionsPlayerInput';
import {InputResponse, isSelectInitialCardsResponse} from '../../common/inputs/InputResponse';

export class SelectInitialCards extends OptionsInput<undefined> {
  constructor(
    private player: IPlayer,
    cb: (corporations: ICorporationCard[]) => undefined,
  ) {
    super('initialCards', '', []);
    const game = player.game;
    const corporations: ICorporationCard[] = [];
    this.title = ' ';
    this.buttonLabel = 'Start';

    if (game.gameOptions.doubleCorpVariant) {
      this.options.push(
        new SelectCard<ICorporationCard>(
          titles.SELECT_TWO_CORPORATIONS_TITLE, undefined, player.dealtCorporationCards, {min: 2, max: 2}).andThen(
          (cards) => {
            if (cards.length !== 2) {
              throw new InputError('Only select 2 corporation card');
            }
            corporations.push(...cards);
            return undefined;
          }),
      );
    } else {
      this.options.push(
        new SelectCard<ICorporationCard>(
          titles.SELECT_CORPORATION_TITLE, undefined, player.dealtCorporationCards, {min: 1, max: 1}).andThen(
          (cards) => {
            if (cards.length !== 1) {
              throw new InputError('Only select 1 corporation card');
            }
            corporations.push(...cards);
            return undefined;
          }),
      );
    }

    // Give each player Merger in this variant
    if (game.gameOptions.twoCorpsVariant) {
      player.dealtPreludeCards.push(new Merger());
    }

    if (game.gameOptions.preludeExtension) {
      this.options.push(
        new SelectCard(titles.SELECT_PRELUDE_TITLE, undefined, player.dealtPreludeCards, {min: 2, max: 2})
          .andThen((preludeCards) => {
            if (preludeCards.length !== 2) {
              throw new InputError('Only select 2 preludes');
            }
            player.preludeCardsInHand.push(...preludeCards);
            return undefined;
          }));
    }

    if (game.gameOptions.ceoExtension) {
      this.options.push(
        new SelectCard(titles.SELECT_CEO_TITLE, undefined, player.dealtCeoCards, {min: 1, max: 1}).andThen((ceoCards) => {
          if (ceoCards.length !== 1) {
            throw new InputError('Only select 1 CEO');
          }
          player.ceoCardsInHand.push(ceoCards[0]);
          return undefined;
        }));
    }

    this.options.push(
      new SelectCard(titles.SELECT_PROJECTS_TITLE, undefined, player.dealtProjectCards, {min: 0, max: 10})
        .andThen((cards) => {
          player.cardsInHand.push(...cards);
          return undefined;
        }),
    );
    this.andThen(() => {
      this.completed(corporations);
      // TODO(kberg): This is probably broken. Stop subclassing AndOptions.
      cb(corporations);
      return undefined;
    });
  }

  private completed(corporations: ICorporationCard[]) {
    const player = this.player;
    const game = player.game;

    const [corporation1, corporation2] = corporations;
    const isDoubleCorpVariant = corporation2 !== undefined;

    // 计算每张起始手牌的费用
    const cardCost = isDoubleCorpVariant ?
      (((corporation1.cardCost ?? player.cardCost) + (corporation2.cardCost ?? player.cardCost)) - player.cardCost) :
      (corporation1.cardCost ?? player.cardCost);

    const totalCardCost = player.cardsInHand.length * cardCost;

    // 计算起始可用 M€
    const availableCredits = isDoubleCorpVariant ?
      ((corporation1.startingMegaCredits ?? 0) + (corporation2?.startingMegaCredits ?? 0) - 42) :
      (corporation1.startingMegaCredits ?? 0);

    if (corporation1.name !== CardName.BEGINNER_CORPORATION && totalCardCost > availableCredits) {
      player.cardsInHand = [];
      player.preludeCardsInHand = [];
      throw new InputError('Too many cards selected');
    }

    const selectedNames = corporations.map((c) => c.name);
    for (const card of player.dealtCorporationCards) {
      if (!selectedNames.includes(card.name)) {
        game.corporationDeck.discard(card);
      }
    }

    for (const card of player.dealtProjectCards) {
      if (player.cardsInHand.includes(card) === false) {
        game.projectDeck.discard(card);
      }
    }

    for (const card of player.dealtPreludeCards) {
      if (player.preludeCardsInHand.includes(card) === false) {
        game.preludeDeck.discard(card);
      }
    }

    for (const card of player.dealtCeoCards) {
      if (player.ceoCardsInHand.includes(card) === false) {
        game.ceoDeck.discard(card);
      }
    }
  }

  public toModel(player: IPlayer): SelectInitialCardsModel {
    return {
      title: this.title,
      buttonLabel: this.buttonLabel,
      type: 'initialCards',
      options: this.options.map((option) => option.toModel(player)),
    };
  }

  public process(input: InputResponse, player: IPlayer) {
    if (!isSelectInitialCardsResponse(input)) {
      throw new InputError('Not a valid SelectInitialCardsResponse');
    }
    if (input.responses.length !== this.options.length) {
      throw new InputError('Incorrect options provided');
    }
    for (let i = 0; i < input.responses.length; i++) {
      player.runInput(input.responses[i], this.options[i]);
    }
    return this.cb(undefined);
  }
}
