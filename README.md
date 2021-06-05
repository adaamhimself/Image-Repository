# Image Repository
 
## Summary
This webservice was designed to store and retrieves images. In addition to the standard CRUD operations, the api also allows searching by keyword and photo comparison.  


## Routes

POST /img : Multer is used to parse and upload images. The image is hashed and the details are stored in a MongoDB database. Images are stored locally. 
  
GET /img?page=&perPage= : Returns all objects, parsed by page and number per page.  
  
GET /img/objectID : Returns a single object with the given ID.  
  
PUT /img/objectID : The body of the request object is used to update the image entry in the database.
  
DELETE /img/objectID : The image with the given ID is deleted from the database and local storage. 
  
  
GET /find - Accepts keywords in the body portion of the request object and searches the database for matches.  
  
POST /find - Multer is used to parse an upload an image and create a hash. The hash is then compared to the hashes stored in the database and the uploaded file is deleted.  
  
