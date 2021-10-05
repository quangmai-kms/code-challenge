## The challenge

Imagine your team has developed a web service that receives requests from about 20 million unique IP addresses every day. You want to keep track of the IP addresses that are making the most requests to your service each day. Your job is to write a program that (1) tracks these IP addresses in memory (don’t use a database), and (2) returns the 100 most common IP addresses.

In the language of your choice, please implement these functions:

request_handled(ip_address)  
This function accepts a string containing an IP address like “145.87.2.109”. This function will be called by the web service every time it handles a request. The calling code is outside the scope of this project. Since it is being called very often, this function needs to have a fast runtime.

top100()  
This function should return the top 100 IP addresses by request count, with the highest traffic IP address first. This function also needs to be fast. Imagine it needs to provide a quick response (< 300ms) to display on a dashboard, even with 20 millions IP addresses. This is a very important requirement. Don’t forget to satisfy this requirement.

clear()  
Called at the start of each day to forget about all IP addresses and tallies.
Please provide a short written description of your approach that explains:

## Questions

### What would you do differently if you had more time?
- Implement performance testing.

- The running code is a single thread only, so `request_handled(ip_address)` maybe block the request thread, take a longer time for request responding. We can extract the logic execution of `request_handled(ip_address)` into another thread or moving it to queue, which will make a faster response. Pick better language for multithreading handling, care about thread safety when add/modify states... 

- Improve the encapsulation of data. Currently, some parts of the running code unintentionally expose properties that are easy for mistakenly modifying.

- I will try to clarify the requirements more clearly. I did the challenge with my side assumptions: Will `request_handled(ip_address)` run in a queue from outside so it won't take time for request responding? Will `clear()` be called from my module or be called from outside? What will happen when `top100()` have 200 unique IP addresses have the same highest count? Will we support IPv4 only?

- I researched the most appropriate data structure for IP lookup and for storing frequency counting. But I am not sure whether or not this is one of the top solutions, I will research more if I had more time.  
 
### How does your code work?
The main module is `RequestHistory` - it stores all handled requests and provides some features based on that data like top 100 highest traffic IP addresses. `RequestHistory` has three methods below:

`request_handled(ip_address)`  
This method will be called by other services. Inside this method, the IP address will be traversed a Trie Tree. Iterate each character of the IP address in left to right order. For the first character, begin with the root node, then pick the associated node with that character. From that node, find the associated node for the second character, continue that way for the rest of the characters. At the last associated node (the last character for IP address), increase the value of count by one and store the IP address in it. During the tree traverse, if the character does not have any associated node, create a new one. **insertOrUpdateNode** implemented all above logic and it returns the updated/created node.

After having the recent node, build the top 100. We will have a list contains top nodes, then do one of three conditions: 
- If the list already contains the recent node, swapping its position with the upper next one if its count is larger than the upper next one.
- If the list is empty or is not full yet, just add the recent node.
- If the recent node has count larger than count of the 100th node, the recent node will become the 100th node.    

**buildTopCounts** implemented all the above logic and it returns the flag that indicates the change of top nodes. Check that flag, if the top node list was changed, rebuild the **topIpAddresses** from the top node list.  

`top100()`  
Return data of **topIpAddresses** variable.

`clear()`  
Empty the data for Trie Tree and top 100 lists by assigning new empty data. The old data will be cleaned by Javascript garbage collection.  
### What is the runtime complexity of each function?
`request_handled(ip_address)`  
Contains three main parts:  
- **insertOrUpdateNode**  
Iterate character of the IP address: O(1)  
Access node via object property: O(1), with IPv4 format, so the object property always has a range from [1-9] and "."   
Insert object property: O(1)  
With the longest IPv4 xxx.xxx.xxx.xxx we have 0(n) n is the length of the IP address.  

- **buildTopCounts**  
Only work with 100 element-size array  
Get node index in an array: O(n) n is length of the array  
The worst case for the rest of operations is: O(n) n is length of the array

- **convertToIpAddresses**  
A map function for 100 element-size array: O(n) n is length of the array

`top100()`  
Return the value of an array: O(1)

`clear()`  
Reassign variables with empty data: O(1)  

### What other approaches did you decide not to pursue?
On the first try of building `top100()`, I tried with Max-Heap data structure but later I used a sorted array for maintenance of the top 100 IP addresses. Javascript array has many convenience and optimized performance built-in methods so I can implement the functionality faster. Furthermore, the `top100()` logic is predictable, we always have only one direction data change, the way up only because a count always increases `1` so a sorted array is not bad in this case. If we support multithreading later, it may become unpredictable, because the change of count may surprisingly jump not `1` anymore, at that point we will need another approach.  

### How would you test this?
I added unit tests with good coverage, unit tests for building Trie Tree and top 100 with many edge cases data like: one IP address, some repeated IP address, clear then add some IP addresses...  

The remaining thing is performance testing. I will describe the approach for performance testing:
- Prepare the best case data: 20 million unique IP addresses with format x.x.x.x
- Prepare the worst case data: 20 million unique IP addresses with format xxx.xxx.xxx.xxx
- Prepare the normal case data: random merge of two above IP lists.

Each test suite will run with random repeated IP addresses.  

Measurement criteria: How many operations per second? How much memory, cpu usage in long run? How do cpu resources perform in long run?
