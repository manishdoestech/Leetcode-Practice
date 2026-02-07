class Solution {
    public int minOperations(int[] nums, int k) {
        int sums=0;
        for(int i:nums){
            sums+=i;
        }
        return sums%k;
    }
}