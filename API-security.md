# Prevent NoSql Injection & Sanitize Data

![Hacking Nodejs and mongodb](https://blog.websecurify.com/2014/08/hacking-nodejs-and-mongodb.html)

## Screenshots:

**Screenshot 1: Login to App using fake json document**

![image](./screenshots/security-1.png)

- here instead of providing email of the user, we give a json document to login. After successul login ,a token is generated as result

- \$gt selects those documents where the value of the field is greater than (i.e. >) the specified value.

- here v get the first user having a value in the email field.

**Screenshot 2: get the current logged in user**

![image](./screenshots/security-2.png)

---

## express-mongo-sanitize

- to bypass this issue we use ![mongo-express-santize](https://www.npmjs.com/package/express-mongo-sanitize) package.

```bash
npm i express-mongo-sanitize
```

**server.js**

- add this before defining the routes.

```javascript
// To remove data, use:
app.use(mongoSanitize());
// replace prohibited characters with _,
app.use(
  mongoSanitize({
    replaceWith: '_',
  })
);
```

**Screenshot: then try login using api**

![image](./screenshots/security-3.png)

**Screenshot 2: using fake json document in both email and password**

![image](./screenshots/security-5.png)

- result will be resource not found error.

- here v cant authenticate since v used _mongo express santize_ in **server.js**

---
