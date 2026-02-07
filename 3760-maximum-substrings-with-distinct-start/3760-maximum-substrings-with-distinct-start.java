class Solution {
    public int maxDistinct(String s) {
        Set<Character> ans=new HashSet<>();
        for(char i:s.toCharArray()){
            ans.add(i);
        }
        return ans.size();
    }
}