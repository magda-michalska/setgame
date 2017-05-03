import { toggleDone, deleteTodo } from '../game_functions';

test('verify if 3 cards are a set', () => {
  const startState = {
    todos: [{ id: 1, done: false, text: 'Buy Milk' }]
  };

  const finState = toggleDone(startState, 1);

  expect(finState.todos).toEqual([
    { id: 1, done: true, text: 'Buy Milk' }
  ]);
});
