# Course Recommendation-engine | Microsoft Engage '22

link for the hosted site : https://recommendation-engine-vg.herokuapp.com/

<br><br>
## Euclidean distance:

Euclidean distance is an algorithm for calculating the distance between two points in a plane or n-dimensional space.

![image](https://user-images.githubusercontent.com/77994881/170842570-10639e1c-ca64-4650-b911-8da759a95850.png)

In the above picture, the points P and Q  are in a plane and represented in a graph, and the distance between these two points is given by Euclidean distance

![image](https://user-images.githubusercontent.com/77994881/170842618-3524d65e-9ed7-4019-bc9c-61fd4ddcb889.png)
<br><br><br>
Euclidean distance tells how a value is related to the other. Lower the value the more relevant ( closer ) the two points are.



<br><br><br>
## ABOUT THE PROJECT<br>

It is a full stack website which demonstrates, how a course recommendation engine works. Whenever a user selects or opens any course from all the available courses, the website will recommend a list of courses which are similar to the course opened by the user.<BR>
The project mainly uses the **sorting algorithm** in order to make recommendations
  
 
<br><br>
## WORKING

The courses are stored in the database and each course have various attributes like-: 
  1. course name
  2. course duration
  3. course genre
  
All the courses are seen as nodes which are plotted on a graph. Whenever user opens any course, then ecuclidean distance to all other courses (using course duration and genre) which are of the same domain ( eg. web dev, data science , management ) are calculated and stored in a list/array. We also keep the track of the courses to the corresponding euclidean distance in a separate list.<br><br>
**The euclidean distance is calculated on the basis of course duration and course genre. It tells us how similar two courses are. Less the value, more similar the courses are**<br>

Then the euclidean distance list is sorted and side by side the corresponding course list is also sorted.<br>
Therefore, now the course list contains all the courses which are of the similar domain to the selected course, but in sorted order on the basis of euclidean distance i.e in the descending order of similarity with the selected course.<br>
Therefore the first course in the list will be most similar to the selected course and the last course in the list will be least similar to the selected course.
<br><br>
Then from this sorted list of courses, we can display top 5-8 courses as recommendation to the user.
 

