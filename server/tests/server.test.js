const expect = require('expect');
const request = require('supertest');
const {
    ObjectID
} = require('mongodb');

const {
    app
} = require('./../server');
const {
    Todo
} = require('./../models/todo');

const {
    User
} = require('./../models/user');

const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

    it('should create a new todo', (done) => {

        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({
                text
            })
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({
                    "text": text
                }).then((todos) => {
                    //console.log(todos);
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => {
                    //done(err);
                });
            });

    });


    it('should not create todo with invalid body data', (done) => {

        request(app)
            .post('/todos')
            .send({})
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => {
                    done(e);
                });
            });
    });
});


describe('GET /todos', () => {

    it('should get all todos', (done) => {

        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);

    });

});


describe('GET /todos/:id', () => {

    it('should return todo doc', (done) => {

        request(app)
            .get(`/todo/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);

    });

    it('should return a 404 if todo not found', (done) => {

        request(app)
            .get(`/todo/${new ObjectID().toHexString()}`)
            .expect(404)
            .set('x-auth', users[0].tokens[0].token)
            .end(done);
    });

    it('should return a 404 for non object ids', (done) => {

        request(app)
            .get(`/todo/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});


describe('DELETE /todo/:id', () => {

    it('should remove a todo', (done) => {

        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todo/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {

                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toBe(null);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });

    });


    it('should return 404 if Todo not found', (done) => {
        request(app)
            .delete(`/todo/${new ObjectID().toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });


    it('should return 404 if Object Id invalid', (done) => {
        request(app)
            .delete(`/todo/123`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});



describe('PATCH /todo/:id', () => {

    it('should update the todo', (done) => {

        var id = todos[0]._id.toHexString();
        var body = {
            text: 'Updated todo',
            completed: true
        }


        request(app)
            .patch(`/todo/${id}`)
            .send(body)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text.toString());
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeGreaterThan(0);
            }).end(done);

    });


    it('should clear the completedAt when todo is not completed', (done) => {

        var id = todos[1]._id.toHexString();
        var body = {
            text: 'Updated todo',
            completed: false
        }


        request(app)
            .patch(`/todo/${id}`)
            .send(body)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(body.text.toString());
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toBe(null);
            }).end(done);

    });


    describe('GET /user/me', () => {

        it('should return if user is authenticated', (done) => {
            request(app)
                .get('/users/me')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect((res) => {
                    console.log("Res Body", res.body);
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                }).end(done);
        });


        it('should return 401 if not authenticated', (done) => {

            request(app)
                .get('/users/me')
                .expect(401)
                .expect((res) => {
                    expect(res.body).toEqual({});
                })
                .end(done);

        });

    });


    describe('POST /users', () => {

        it('should create a user', (done) => {

            var email = "example@example.com";
            var password = "123mnb!";

            request(app)
                .post('/users')
                .send({
                    email,
                    password
                })

                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toBeTruthy();
                    expect(res.body._id).toBeTruthy();
                    expect(res.body.email).toBe(email);
                }).end((err) => {
                    if (err) {
                        return done(err);
                    }

                    User.findOne({
                        email
                    }).then(user => {
                        expect(user).toBeTruthy();
                        expect(user.password).not.toBe(password);
                        done();
                    });
                });

        });

        it('should return validation error if request invalid', (done) => {

            var email = "exampleexample.com";
            var password = "123mnb!";

            request(app)
                .post('/users')
                .send({
                    email,
                    password
                })
                .expect(400)
                .end(done);

        });

        it('should should not create a user if email in use', (done) => {

            var email = users[0].email;
            var password = "123mnb!";

            request(app)
                .post('/users')
                .send({
                    email,
                    password
                })
                .expect(400)
                .end(done);


        });

    });


    describe('POST /users/login/', () => {

        it('Should login user and return auth token', (done) => {

            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password
                })
                .expect(200)
                .expect((res) => {
                    expect(res.headers['x-auth']).toBeTruthy();

                }).end((err, res) => {

                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then(user => {

                        expect(user.tokens[0].access).toBe('auth');

                        expect(user.tokens[0].token).toBe(res.headers['x-auth']);

                        done();

                    }).catch(e => done(e));
                });

        });

        it('should reject invalid login', (done) => {

            request(app)
                .post('/users/login')
                .send({
                    email: users[1].email,
                    password: users[1].password + "Change"
                })
                .expect(400)
                .expect((res) => {
                    expect(res.headers['x-auth']).not.toBeTruthy();

                }).end((err) => {

                    if (err) {
                        return done(err);
                    }

                    User.findById(users[1]._id).then(user => {

                        expect(user.tokens.length).toBe(0);

                        done();

                    }).catch(e => done(e));
                });


        });

    });

    describe('DELETE /users/me/token', () => {

        it('should remove the auth token on logout', (done) => {

            request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err) => {

                    if (err) {
                        return done(err);
                    }

                    User.findById(users[0]._id).then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch(e => {
                        done(e);
                    });

                });

        });

    });
});