This is a README file. Served using the express.static() middleware. 
The express.static() middleware is used to serve static content.

As an additional point, we can use the below syntax to set environment variables on the windows powershell.
In the syntax below, we set the lifecycle environment, port and run nodemon to restart our server.
It is a good practice to nest the command to set env variables with the command to restart the server
    $env:NODE_ENV='production' ; $env:PORT='3000' ; nodemon