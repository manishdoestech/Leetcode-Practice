class Solution:
    def licenseKeyFormatting(self, s: str, k: int) -> str:
        s = s.replace('-', '').upper()
        return '-'.join([s[max(i - k, 0):i] for i in range(len(s), 0, -k)][::-1])