# User Authentication Part 2

## Bootcamp & User RelationShip

- Add a user field in bootcamp model that reference to the User model.

```javascript
user: {
    type: mongoose.STATES.ObjectId,
    ref: 'User',
    required: true
  }
```

- to add user field to bootcamp changes to controllers

**controllers/bootcamps.js**

```javascript
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add user to the req.body.user,
  req.body.useruser = req.user.id;

  // check bootcamps published by the current user
  const bootcampsPublished = await Bootcamp.findOne({
    user: req.user.id,
  });

  // Note: if user is not an admin, add only one bootcamp, else can add any no of bootcamps

  // check if user published a bootcamp and role is not admin,
  if (bootcampsPublished && req.user.role !== 'admin') {
    // return error since already added a bootcamp
    return next(
      new ErrorResponse(
        `the role ${req.user.role} already one bootcamp- cant add more`,
        400
      )
    );
  }
  // await for the Promise to get resolved
  const bootcamp = await Bootcamp.create(req.body);

  // send back the resposne - 201: since new resource created
  res.status(201).json({
    succes: true,
    data: bootcamp,
  });
});
```

- later update the database seeder ie, **seeder.js**

* delete all current data

```bash
node seeder -d
```

In postman,

1. register new user

2. later, create new bootcamp

3. this newly created boocamp will have yhe _user field_ with id of current logged in user.

### Screenshot 1 - get logged in user:

![image](./screenshots/imageedit_2_5795774125.png 'image')

### Screenshot 2 - post bootcamp after login:

![image](./screenshots/imageedit_5_9486120982.png 'image')

---

## Setting Ownership for the bootcamp

- suppose a user created a bootcamp- only he should have tht permisson to update that bootcamp - notother user can manage that bootcamp.
- so v set ownership for that bootcamp.
- thus it can be managed by the user who owns it.
