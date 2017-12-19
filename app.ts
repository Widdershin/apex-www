import { h1, div, input, p, button, DOMSource, VNode } from '@cycle/dom';
import { TimeSource } from '@cycle/time';
import { Stream } from 'xstream';

interface Sources {
  DOM: DOMSource;
  Time: TimeSource;
}

interface Sinks {
  DOM: Stream<VNode>;
}

interface Reward {
  price: number;
  name: string;
}

const HEADER = div([
  p(
    `I started skating downhill six years ago, when I was sixteen. It has changed my life, introduced me to amazing friends, and exposed me to joy and loss like nothing else.`
  ),
  p(
    `As long as I've been skating, I've wanted to make a game that manages to capture a small part of the indescribable experience that is downhill skateboarding.`
  ),
  p(
    `I've tried many times over the last half a decade to make the downhill game of my dreams. Just like skateboarding, my first attempts were a painful failure. But I kept getting back up.`
  ),
  p(`My latest prototype, codenamed Apex, is the start of my vision.`),
  p(
    `Apex is not a game about points and combos. Apex is about finding the perfect line, pushing your limits, and flowing with friends. Apex is about sessioning spots, crafting the perfect setup and racing neck and neck.`
  ),
  p(
    `Apex is currently in early development. The basics of downhill skateboarding are in place, including sliding.`
  ),
  p(
    `When Apex is released, my plan is for it be free to play. This is because I believe that everyone should be able to play, regardless of their financial status.`
  ),
  p(
    `However, video games cost money to make, so we would keep development going by selling new hills and cosmetics like gear. I am firmly opposed to pay to win games, so we would not do that.`
  ),
  p(
    `I want to wait to release Apex until it is feature complete, polished and has a lot of quality content. In the mean time, we need funding to pay people to produce quality content.`
  ),
  p(
    `If you want an awesome downhill skateboarding game as much as we do, please support Apex!`
  ),
  p(
    `Becoming a supporter means you can play the early access builds, and much more.`
  )
]);

const rewards: Reward[] = [
  {
    price: 300,
    name: 'Design your own board and own it in game'
  },
  {
    price: 150,
    name: 'Early access to hill building tools in future'
  },
  {
    price: 100,
    name: 'Extra special thanks in the credits'
  },
  {
    price: 50,
    name:
      'Access to a chat so you can talk with the development team and other supporters'
  },
  {
    price: 30,
    name: 'Your choice of rare gear - early access only'
  },
  {
    price: 15,
    name: 'Your name in the credits'
  },
  {
    price: 10,
    name: 'Early access to development builds'
  }
].reverse();

function rewardsView(paymentAmount: number): VNode {
  return div(
    '.rewards',
    rewards.map(reward => {
      const unlocked = paymentAmount >= reward.price;

      return div(
        '.reward',
        { class: { unlocked } },
        (unlocked ? '🎉' : '🔒') + ' $' + reward.price + ' ' + reward.name
      );
    })
  );
}

const priceButtons = rewards.map(r => r.price);

function view(paymentAmount: number): VNode {
  return div('.container', [
    h1('Apex Early Access'),
    HEADER,
    div('Become a supporter of Apex.'),
    div('.payments', [
      div('Choose payment amount: (minimum $10)'),
      div(
        priceButtons.map(price =>
          button(
            '.change-payment-amount',
            { attrs: { 'data-value': price } },
            '$' + price
          )
        )
      ),

      input('.payment-amount', {
        props: { type: 'range', value: paymentAmount, min: 10, max: 300 }
      }),
      '$',
      input('.payment-amount', {
        props: { type: 'number', value: paymentAmount }
      }),

      div(
        paymentAmount === 300
          ? 'If you like, you can contribute more by entering a number into the box above.'
          : ''
      )
    ]),
    div('Rewards:'),
    rewardsView(paymentAmount)
  ]);
}

export function main(sources: Sources): Sinks {
  const paymentAmountInput$ = sources.DOM
    .select('.payment-amount')
    .events('input')
    .map(ev => parseInt((ev.target as any).value, 10))
    .filter(Number.isInteger);

  const paymentAmountButton$ = sources.DOM
    .select('.change-payment-amount')
    .events('click')
    .map(ev => parseInt((ev.target as any).dataset.value, 10));

  const paymentAmount$ = Stream.merge(
    paymentAmountInput$,
    paymentAmountButton$
  ).startWith(10);

  return {
    DOM: paymentAmount$.map(view)
  };
}
