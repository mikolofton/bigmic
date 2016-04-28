# Getting Started
***
### 1. Install MongoDB if you haven't already
#### [Installation instructions here](https://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/ "MongoDB Install Instructions OSX")

For 'Run MongoDB > Step 2', run this command to set permissions on the data directory:

    $ sudo chown -R $USER /data/db

### 2. Clone the repo:
    $ git clone http://git.dto.accenture.com/mindy.tchieu/big-mic.git

### 3. Start the database:
    $ mongod

### 4. In a new Terminal window, we're going to configure Mongo:
    $ mongo

### 5. In the Mongo shell, switch to bigmic's database:
    $ use bigmic

Should output: 'switched to db bigmic'. The `use` command will create the database for you if it doesn't exist.

### 6. Create the users collection:
    $ db.createCollection('users')

Should output: { "ok" : 1 }

### 7.  To check that we are on the right path:
    $ show dbs (should output 'bigmic 0.000GB' and 'local 0.000 GB')
    $ show collections (should output 'users')

### 8. Install our dependencies. In a new Terminal window:
    $ cd big-mic
    $ npm install

### 9. Start our server:
    $ nodemon server

Last line should say: 'Listening to port 3000'

### 10. Go to http://localhost:3000 in your browser and you should see the Big Mic welcome screen

### 11. Pat yourself on the back :thumbsup:

***

## Troubleshooting
### Error when running `brew update` in Step 1:
> Error: Failure while executing: git pull -q origin refs/heads/master:refs/remotes/origin/master

#### How to fix:  
##### 1. Set permissions by changing ownership of folder:
    $ sudo chown -R $USER /usr/local

##### 2. CD to directory and pull latest changes
    $ cd /usr/local
    $ sudo git reset --hard FETCH_HEAD

Should see: 'HEAD is now at ...'

##### 3. Replace checkout with latest files
    $ git checkout Library

##### 5. Try updating again:
    $ brew update

[Solution found on Stack Overflow](http://stackoverflow.com/questions/6933959/error-while-trying-to-update-brew-package-manager)

***

## Mongo for Newbies (aka me)
- In Terminal window, type `mongo`
- `use bigmic` to use our bigmic db
- `show collections` to see our collections
- `db.[collection name - users].find().pretty()` to view all users
- `db.users.update({}, {$set: {isActive: false}}, { multi: true })` - add 'isActive' property to all documents in users collection  
- `db.users.update({}, {$unset: {isActive: 1}}, { multi: true })` - remove 'isActive'

***

### Error when running `mongod` in Step 4:
> Exception in initAndListen: 29 Data directory /data/db not found.

#### How to fix:
##### 1. Create the directory:  
    $ sudo mkdir -p /data/db

##### 2. Set permissions for the data directory:
    $ sudo chown -R $USER /data/db

##### 3. Try running it again:
    $ mongod

***

## LinkedIn Accounts
username: mindy.tchieu@accenture.com
linked in pw: testing123

username: bigmicmarty@gmail.com
linked in pw: testing123
gmail pw: bigmic123
