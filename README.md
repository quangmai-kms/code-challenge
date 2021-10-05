## The challenge

Imagine your team has developed a web service that receives requests from about 20 million unique IP addresses every day. You want to keep track of the IP addresses that are making the most requests to your service each day. Your job is to write a program that (1) tracks these IP addresses in memory (don’t use a database), and (2) returns the 100 most common IP addresses.

In the language of your choice, please implement these functions:

`request_handled(ip_address)`  
This function accepts a string containing an IP address like “145.87.2.109”. This function will be called by the web service every time it handles a request. The calling code is outside the scope of this project. Since it is being called very often, this function needs to have a fast runtime.

`top100()`  
This function should return the top 100 IP addresses by request count, with the highest traffic IP address first. This function also needs to be fast. Imagine it needs to provide a quick response (< 300ms) to display on a dashboard, even with 20 millions IP addresses. This is a very important requirement. Don’t forget to satisfy this requirement.

`clear()`  
Called at the start of each day to forget about all IP addresses and tallies.
Please provide a short written description of your approach that explains:

## Questions

### What would you do differently if you had more time?
- I will add performance testing.

- The running code is a single thread only, so `request_handled(ip_address)` maybe block the request thread, make longer time for request responding. We can extract the logic execution of `request_handled(ip_address)` into another thread or moving it to queue, that will make faster request responding. Pick better language for multithreading handling, care about thread safety when add/modify states... 

- I will improve the encapsulation of data. Currently, some parts of the running code unintentionally expose properties that are easy for mistakenly modifying. I will try to reduce that surface area if I had more time.

- I will try to clarify the requirements more clearly. I did the challenge with my side assumptions: Will `request_handled(ip_address)` run in a queue from outside so it won't take time for request responding? Will `clear()` be called from my module or is called from outside? What will happen when `top100()` have 200 unique IP addresses have the same highest count? Will we support IPv4 only?

- I researched the most appropriate data structure for IP lookup and for storing frequency counting. But I am not sure whether or not this is one of the top solutions, I will research more if I had more time.

### What is the runtime complexity of each function?
TODO

### How does your code work?
The main module is `RequestHistory` - it stores all handled requests and provide some features based on that data like top 100 highest traffic IP addresses. `RequestHistory` has three methods below:


`request_handled(ip_address)`  
This method will called by other services. Inside this method, the IP address will be traversed a Trie Tree, then updated it or store it in the new node. Then we will build the top 100 with that node, then if the top 100 has built/changed we will recreate the string only version for top 100 nodes and store it in `topIpAddresses` variable.

`top100()`  
Return data of `topIpAddresses` variable.

`clear()`  
Empty the data for Trie Tree and top 100 lists by assigning new empty data. The old data will be cleaned by javascript garbage collection.

### What other approaches did you decide not to pursue?
At the first trying of building `top100()`, I tried with Max-Heap data structure but later I used sorted array for maintenance top 100 IP addresses. Javascript array has many convenience and optimized performance built-in methods so I can implement the functionality faster. Furthermore, the `top100()` logic is predictable, we always have only one direction data change, the way up only because count always increases `1` so a sorted array is not bad in this case. If we support multithreading later, it maybe become unpredictable, because the change of count may surprisingly jump not `1` anymore, at that point we will need another approach.

### How would you test this?
I added unit tests with good coverage. The remaining thing is performance testing. I need time to research more about the good approach for performance testing.


