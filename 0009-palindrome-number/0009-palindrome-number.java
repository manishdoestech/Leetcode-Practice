class Solution {
    public boolean isPalindrome(int x) {
        //reversing digits
        if(x<0) return false;
        int original=x;
        int reversed=0;
        while(x!=0){
            reversed=x%10+10*reversed;
            x/=10;
        }
        return reversed==original;
    }
}