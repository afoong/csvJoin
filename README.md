# CSV Join
---

## How do we run your program?

###1. Install node v0.8.12
##### Ubuntu
* run the nodeBuilder.sh script

    - sudo ./nodeBuilder.sh

##### Other Environments
* please refer to the [node wiki](https://github.com/joyent/node/wiki/Installation)

###2. Install npm packages
From the root app directory

    - npm install

###3. Run the app

    - node app.js

The app runes on port 3000

## Design and Approach

#### Backend

###### No Database

* I tried to not use a database
  * I thought this would defeat the purpose of writing a csv-join app, as a relational database could get the job done very easily

###### Separate Routing from Business Logic

* Controllers should be kept light-weeight, and most of the processing logic offloaded to a service.
  * most of the csv processing was sent to services/joinService.js
* Dynamic partials
  * views/upload.jade would support another route that needed the same javascript files, but not the same form-content
    * routes/join.js routes that wish to share upload.jade can specify the content variable on call of render

###### Joining two files

* Given that 
> You may assume that the first column is the common key
  * I used node-formidable to send the upload stream to *ya-csv*'s **CsvStreamReader**
    * from there I put the data into a javascript object
    * because I could assume that the common key was the first column, I made each employee record key off of *a+employeeId*
      * without the "a" character, there would have been a lot of empty spots in the map
  * the object:
  

            {
              a1: { 
                e: [id, first, last, dob, sex, start date],
                s: [
                  [id, salary, salary start, salary end],
                  [id, salary, salary start, salary end],
                ]
              },
              a2: ...
            }


    * I passed the object into the context of a jade partial for rendering, and send the rendered output to the front end
    * I stored each employee's salary data in a data attribute in the dom
  * Please note:
    * **I assume that the employee's basic data comes from a CSV with 6 columns**
    * **I assume that the employee's salary data comes from a CSV with 4 columns**

#### Frontend

###### Bootstrap

* I used twitter's bootstrap css framework (and their javascript-modal plugin)
  * This allowed me to create a prettier UI faster. It also helped me keep a somewhat consistent dom structure.

###### DOM

* Tables only used for tabular data
  * It's a given, but always worth mentioning.

###### Templating

* Layouts should be extenisble
  * One day you might want to swap out a skin on certain pages only
  * Certain javascript only needs to be on some pages
    * see views/index.jade vs views/upload.jade

###### Uploads

* I didnt know that an ajax file upload was not possible, although it makes sense after reasearching it
  * I had to use the iframe submit trick to fake an ajax submit
    * I created a jQuery plugin
      * jQuery plugins should maintain chainability
  * If I more time, I would've liked to implement a socket.io file upload (for more accurate filetransfer %s)
* I only allow csv uploads ( file must have csv extension )
* I require two files to be uploaded

## Features
* Uploads two files but does not save them to disk
* Joins the data on the common key (column 1)
* Displays employee data after the upload is complete
* Salary information is shown after you click an employee's name
* Progress bar shows progress during upload/join step

## Not Features
* No graphs :(
* No analytics
* There are no unit tests
    * shame

## Limitations
* The app may not be happy if you were to give it a super huge dataset
** The test had ~7000 rows to process, but something like a million may be too much to put into memory.


## Learning is fun

Things I learned while working on this project:
* How to Map Reduce
  * Although, I ended up not using it
* How to write a jQuery plugin
* How to work with files in node.js
* How to upload a file
* How to fake an ajax file upload

## Sources of inspriation and informatino

* http://www.componentix.com/blog/9/file-uploads-using-nodejs-now-for-real
* https://github.com/visionmedia/jade/issues/510
* http://j-query.blogspot.com/2012/02/expressjs-dynamic-helpers-vs-middleware.html
* http://viralpatel.net/blogs/ajax-style-file-uploading-using-hidden-iframe/
* https://github.com/felixge/node-formidable
* http://docs.jquery.com/Plugins/Authoring
* http://www.senchalabs.org/connect/middleware-bodyParser.html
* https://github.com/wdavidw/node-csv-parser
* https://github.com/dominictarr/map-reduce

## Time taken

* I estimate that this app took me about 15-17 hours to write. (including docs/comments)
  * Excuses =/
    * Being in Pentaho loader land and bash land for the past 3 months have dulled my node.js skills. 
    * I had not looked at a line of node in about 6 months prior to this.
    * It included a lot of research on things that I had never done before. 
      * Some of the things I researched worked, and some didn't.
    * Also.. I may have exceeded balmer's peak at some point saturday night
* At one point, I coded myself into a wall, and had to scrap half of the controller as well.
  * Lesson I learned from that: 
    * If code you are writing seems too complicated, there is probably a library on the internet that does what you want for you. 
    * Unfortunately, you might also have to read more than the first 10 lines of the docs to find your answer.

