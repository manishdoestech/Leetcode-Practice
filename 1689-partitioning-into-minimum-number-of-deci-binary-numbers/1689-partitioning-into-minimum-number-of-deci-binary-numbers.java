class Solution {
    public int minPartitions(String n) {
        int[] arr = new int[n.length()];
        for (int i = 0; i < n.length(); i++) {
    arr[i] = n.charAt(i)- '0';
}
Arrays.sort(arr);
return arr[n.length()-1];
    }
}