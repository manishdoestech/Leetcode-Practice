class Solution {
    public int minimumOperations(int[] nums) {
        int ans=0;
        for(int i:nums){
            int rem=i%3;
            if(rem==2)
                rem=1;
            ans+=rem;
        }
        return ans;
    }
}