## A weighted random picker

The idea is to a weighted random picker, and after someone got picked, their chance of getting picked becomes smaller. [gh page to try out](https://tunhuang.github.io/weighted-random-picker/)

The chance of getting picked is determined by the index in the array and the sum of the indices.

For example we have a class with 16 students. We put their name in the array. The sum of the indices (0 + 1 + 2 ... + 15) is 120. The chance of getting picked is 0/120, 1/120, 2/120... respectively

0.00%, 0.83%, 1.67%, 2.50%, 3.33%, 4.17%, 5.00%, 5.83%, 6.67%, 7.50%, 8.33%, 9.17%, 10.00%, 10.83%, 11.67%

After someone got picked, they'll be moved to index 0, and everyone previously behind them moves one index forward. It means that it's impossible that someone gets picked twice in a row. And the chance of someone getting picked increases with time till they get picked.

## How to use

Add the names of the participants, seperated with commas, with the textarea and the Add-button. You can make the chance, that certain participants getting picked the first time, bigger by putting their names at the end of the list. Or you can just put them in in random order.

Use the Pick-button to pick someone from the list. They'll be moved the the start of the list (index 0 of the array).

Use the Clear-button to clear the list.

Use the Shuffle-button to shuffle the list and make the order random.
