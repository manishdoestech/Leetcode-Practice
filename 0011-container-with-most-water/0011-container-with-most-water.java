class Solution {
    public int maxArea(int[] height) {
        int max=0;
        int left=0;
        int right=height.length-1;
        while(left<right){
            int minimum=Math.min(height[left],height[right]);
            int full=minimum*(right-left);
            if(full>max){
                max=full;
            }
            if(minimum==height[right]) right--;
            else left++;
        }
        return max;
    }
}