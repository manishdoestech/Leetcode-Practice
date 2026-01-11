import java.util.HashMap;
import java.util.Map;

class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) {
            return false;
        }
        Map<Character, Integer> result = new HashMap<>();
        for (int i = 0; i < s.length(); i++) {
            result.merge(s.charAt(i), 1, Integer::sum);
            result.merge(t.charAt(i), -1, Integer::sum);
        }
        // Return true only if all counts cancel out to zero
        return result.values().stream().allMatch(v -> v == 0);
    }
}