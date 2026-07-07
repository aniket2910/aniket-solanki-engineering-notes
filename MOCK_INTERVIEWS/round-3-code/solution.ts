/**
 * Returns the k most frequent elements in the nums array.
 * Time Complexity: O(N) where N is the length of nums.
 * Space Complexity: O(N) for the frequency map and buckets.
 */
export function topKFrequent(nums: number[], k: number): number[] {
  // Step 1: Count frequency of each number
  const freqMap = new Map<number, number>();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }

  // Step 2: Create buckets where the index represents frequency
  // Max possible frequency is nums.length, so we need size nums.length + 1
  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);

  // Step 3: Distribute numbers into buckets based on their frequency
  for (const [num, freq] of freqMap.entries()) {
    buckets[freq].push(num);
  }

  // Step 4: Gather top k frequent elements by scanning buckets from right to left
  const result: number[] = [];
  for (let i = buckets.length - 1; i >= 0; i--) {
    if (buckets[i].length > 0) {
      for (const num of buckets[i]) {
        result.push(num);
        if (result.length === k) {
          return result;
        }
      }
    }
  }

  return result;
}
