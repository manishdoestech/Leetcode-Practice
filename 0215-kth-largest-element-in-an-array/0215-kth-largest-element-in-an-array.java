class Solution {
    public int findKthLargest(int[] nums, int k) {
        Integer[] objectArray = Arrays.stream(nums)
                              .boxed()
                              .toArray(Integer[]::new);
        Arrays.sort(objectArray,Collections.reverseOrder());
        return objectArray[k-1];
    }
}