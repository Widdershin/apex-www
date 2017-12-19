import { makeDOMDriver, div, input, DOMSource, VNode } from '@cycle/dom';
import { timeDriver, TimeSource } from '@cycle/time';
import { run } from '@cycle/run';
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
    name: 'Extra special thanks in the credits',
  },
  {
    price: 50,
    name: 'Access to the dev team chat channel'
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
];

function rewardsView(paymentAmount: number): VNode {
  return div(
    '.rewards',
    rewards.map(reward =>
      div(
        '.reward',
        { class: { unlocked: paymentAmount >= reward.price } },
        '$' + reward.price + ' ' + reward.name
      )
    )
  );
}

function view(paymentAmount: number): VNode {
  return div('.container', [
    div('Become a supporter of Apex'),
    div('Rewards:'),
    rewardsView(paymentAmount),
    div('.payments', [
      div('Choose payment amount: (minimum $10)'),
      input('.payment-amount', {
        props: { type: 'range', value: paymentAmount, min: 10, max: 300 }
      }),
      '$',
      input('.payment-amount', {
        props: { type: 'number', value: paymentAmount }
      }),

      div(paymentAmount === 300 ? 'If you like, you can contribute more by entering a number into the box above.' : '')
    ])
  ]);
}

function main(sources: Sources): Sinks {
  const paymentAmount$ = sources.DOM
    .select('.payment-amount')
    .events('input')
    .map(ev => parseInt((ev.target as any).value, 10))
    .filter(Number.isInteger)
    .startWith(10);

  return {
    DOM: paymentAmount$.map(view)
  };
}

const drivers = {
  DOM: makeDOMDriver(document.body),
  Time: timeDriver
};

run(main, drivers);
