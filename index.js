const express = require('express');

const db = require('./data/db.js');

const server = express();
server.use(express.json()); // this allows POST and PUT to work

// App Root
server.get('/', (req, res) => {
  res.send('Server is responding');
});

// READ USERS
server.get('/api/users', (req, res) => {
  db.find()
  .then(users => {
    res.status(200).json(users);
  })
  .catch(error => {
    res.status(500).json({ error: "The users information could not be retrieved." });
  })
})

// READ USER
server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;

  db.findById(id)
  .then(user => {
    if(user) {
      res.status(200).json({ user })
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist." });
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The user information could not be retrieved." })
  })
})

// CREATE USERS
server.post('/api/users', (req, res) => {
  const newUser = req.body;
  console.log('user info: ', newUser);

  if(newUser.name && newUser.bio){
    db.insert(newUser)
    .then(id => {
      res.status(201).json(id);
    })
    .catch(error => {
      res.status(500).json({ error: 'There was an error while saving the user to the database' });
    })
  } else {
    console.log("Missing Name or Bio");
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.'})
  }
})


// DELETE USERS
server.delete('/api/users/:id', (req, res) => {
  const id = req.params.id;
  // console.log("Delete Running");
  // console.log("id: ", id);

  db.remove(id)
  .then(deleted => {
    if(deleted) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: "The user with the specified ID does not exist."});
    }
  })
  .catch(error => {
    res.status(500).json({ error: "The user could not be removed" })
  })
})


// UPDATE USERS
server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if( updates.name && updates.bio ){
    db.update(id, updates)
    .then( count => {
      console.log("User Updated")
      if(count === 1) {
        db.findById(id)
        .then(user => {
          res.status(200).json({ user })
        })
        .catch(error => {
          res.status(500).json({ error: "The user information could not be retrieved." })
        })
      } else {
        res.status(404).json({ message: "The user with the specified ID does not exist." })
      }
    })  // END .then from db.update
    .catch(error => {
      res.status(500).json({ error: "The user information could not be modified." })
    })
  } else {
    res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
  }

})


server.listen(3000, () => {
  console.log('\n** API up and running on port 3k **');
});