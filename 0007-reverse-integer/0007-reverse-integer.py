class Solution:
    def reverse(self, x: int) -> int:
        s = str(x)      
        if s[0] == '-':
            a=int('-' + s[:0:-1])
            return 0 if a<(-2**31) else a
        else:
            b=int(s[::-1])
            return 0 if b>(2**31-1) else b