class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        maps={}
        for i in nums:
            if i in maps:
                return True
            maps[i]=True
    
        return False