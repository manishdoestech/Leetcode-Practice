class Solution:
    def detectCapitalUse(self, word: str) -> bool:
        a=word.lower()
        b=list(a)
        c=list(word)
        d=[]
        for i in range(len(b)):
           d.append(ord(b[i])-ord(c[i]))
        if d.count(0)==len(word):
            return True
        elif d.count(32) ==len(word):
            return True
        elif d.count(0) == (len(word)-1) and d.count(32)==1 and d[0]==32:
            return True
        else:
            return False