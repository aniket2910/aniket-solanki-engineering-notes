import type { ProblemNote } from "../../types.ts";

const note: ProblemNote = {
  slug: "best-time-to-buy-and-sell-stock",
  pattern: "One pass with running min",
  topics: ["Array", "Dynamic Programming"],
  companies: ["Amazon", "Microsoft", "Google", "Meta", "Bloomberg", "Apple", "Goldman Sachs", "Uber"],
  gist: "For each day, the best sale is today's price minus the cheapest price before it. Track that cheapest price as you go.",
  statement: `You're given \`prices\`, where \`prices[i]\` is a stock's price on day \`i\`. Choose **one day to buy** and a **later day to sell** to maximise profit.

Return the maximum profit. If no profit is possible, return \`0\`.`,
  constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
  examples: [
    { input: "prices = [7, 1, 5, 3, 6, 4]", output: "5", explain: "Buy on day 1 (price 1), sell on day 4 (price 6). Selling at 7 isn't allowed: day 0 comes before the buy." },
    { input: "prices = [7, 6, 4, 3, 1]", output: "0", explain: "Prices only fall, so don't trade." },
  ],
  predict: [
    { input: "prices = [2, 4, 1]", output: "2", why: "Buy at 2, sell at 4. The later low of 1 has no day after it to sell on." },
    { input: "prices = [5]", output: "0", why: "One day: you can't buy and sell on different days." },
    { input: "prices = [3, 3, 3]", output: "0", why: "Flat prices, no profit." },
  ],
  edgeCases: ["Single day → 0", "Strictly falling prices → 0, never negative", "Global minimum is the last day (can't be used to buy)"],
  hints: [
    "Brute force tries every buy day with every later sell day. Which part of that work is repeated?",
    "If you decide to sell on day i, which buy day is best? You only need one number about the past.",
    "Keep `minPrice` (cheapest so far). For each price: `best = max(best, price - minPrice)`, then `minPrice = min(minPrice, price)`.",
  ],
  approaches: [
    {
      name: "Try every pair",
      idea: "For every buy day i and every later sell day j, compute prices[j] − prices[i] and keep the max. Correct, but quadratic — 10⁵ days means 5 × 10⁹ pairs.",
      complexity: { time: "O(n²)", space: "O(1)", why: "Nested loops over n days: n(n−1)/2 pairs." },
      code: `function maxProfit(prices: number[]): number {
  let best = 0;
  for (let i = 0; i < prices.length; i++)
    for (let j = i + 1; j < prices.length; j++) best = Math.max(best, prices[j] - prices[i]);
  return best;
}`,
    },
    {
      name: "One pass, cheapest price so far",
      idea: "The best sale on day i uses the cheapest price before day i. Keep that minimum as you scan, and compare today's profit against the best seen. Updating the profit before the minimum guarantees you never sell on the same day you buy.",
      complexity: { time: "O(n)", space: "O(1)", why: "Each price is visited once; two numbers of state." },
      code: `function maxProfit(prices: number[]): number {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    best = Math.max(best, price - minPrice);
    minPrice = Math.min(minPrice, price);
  }
  return best;
}`,
    },
  ],
  complexityTalk: `O(n²) → O(n) is the whole point. With 10⁵ days, the pair loop does ~5 × 10⁹ comparisons (tens of seconds); the single pass does 10⁵. The trick is noticing the inner loop recomputes "minimum of the prefix" every time, and that minimum can be **carried forward** in O(1).

That's the core idea of **dynamic programming** in its smallest form: keep the answer to a subproblem (best buy price up to today) so you never recompute it. It's also **Kadane's algorithm** in disguise: the profit series is the maximum subarray sum of the daily price differences.`,
  interview: {
    script: `"Brute force checks every buy-sell pair, O(n²), which is 5 times 10⁹ operations for 10⁵ days. But if I sell on day i, the best buy is simply the cheapest price before day i. So I scan once, keeping the minimum price seen so far and the best profit. For each price, I first compute price minus min and update best, then update min — in that order so I never buy and sell on the same day. Best starts at 0, so falling prices return 0. It's O(n) time and O(1) space."`,
    keywords: [
      { term: "Running minimum / prefix min", meaning: "The one fact about the past that matters." },
      { term: "Single pass", meaning: "O(n) instead of checking every pair." },
      { term: "Kadane's algorithm", meaning: "Same problem as max subarray sum over daily differences." },
      { term: "DP state", meaning: "min so far = the subproblem answer carried forward." },
    ],
    bonus: ["Connect it to Kadane's algorithm on the difference array.", "Explain why the update order (profit first, then min) matters.", "Mention the follow-up family: unlimited trades, k trades, cooldown, fees."],
    mistakes: ["Returning max − min of the whole array (the min might come after the max)", "Initialising best to −Infinity and returning a negative profit", "Sorting the prices (destroys the time order)"],
    followUps: [
      { q: "Unlimited transactions (Stock II)?", a: "Add every positive day-to-day increase: sum of max(0, prices[i] − prices[i−1]). O(n)." },
      { q: "Return the buy and sell days, not just the profit?", a: "Track the index of the running min, and record (minIndex, i) whenever best improves." },
      { q: "At most two transactions (Stock III)?", a: "Track four states in one pass — buy1, sell1, buy2, sell2 — each updated from the previous one. O(n), O(1)." },
    ],
  },
  starter: `function maxProfit(prices: number[]): number {

}`,
  tests: [
    { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { args: [[7, 6, 4, 3, 1]], expected: 0, label: "Falling prices" },
    { args: [[2, 4, 1]], expected: 2 },
    { args: [[5]], expected: 0, label: "Single day" },
    { args: [[3, 3, 3]], expected: 0 },
    { args: [[1, 2, 3, 4, 5]], expected: 4 },
  ],
};

export default note;
