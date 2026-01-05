class Solution {
    public boolean isPalindrome(int x) {
        //reversing digits
        if(x<0||(x%10==0 && x!=0)) return false;
        int reversedHalf=0;
        while(x>reversedHalf){
            reversedHalf=x%10+10*reversedHalf;
            x/=10;
        }
        return reversedHalf==x||x==reversedHalf/10;
    }
}