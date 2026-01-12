class Solution {
    public boolean containsDuplicate(int[] nums) {
        Map<Integer,Integer> hello=new HashMap<>();
        for(int num:nums){
            hello.put(num, hello.getOrDefault(num, 0) + 1);
            if (hello.get(num) > 1) {
                return true;
            }
        }
        return false;
    }
}