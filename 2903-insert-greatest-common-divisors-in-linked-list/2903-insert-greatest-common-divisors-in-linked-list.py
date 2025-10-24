# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

class Solution:
    def _gcd(self, a: int, b: int) -> int:
        a, b = abs(a), abs(b)
        while b:
            a, b = b, a % b
        return a

    def insertGreatestCommonDivisors(self, head: Optional[ListNode]) -> Optional[ListNode]:
        ##empty or single node
        if not head or not head.next:
            return head
        ##other conditions
        current=head
        while current and current.next:
            node1=current
            node2=current.next
            gcd=self._gcd(node1.val,node2.val)
            gcd_Node=ListNode(gcd,next=node2)
            node1.next=gcd_Node
            current=node2
        return head