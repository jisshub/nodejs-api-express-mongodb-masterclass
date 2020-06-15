# using multiple query params

- GET /api/v1/bootcamps?location.state=MA&housing=true

- to get the output, use _req.query_

**controllers/bootcamp.js**

```javascript
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find(req.query);
  // get query params from api
  console.log(req.query);
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
```

### using symbols like gt, lt, in, with in a query params

- GET /api/v1/bootcamps?averageCost[lt]=8000

@desc - get documents having a field named averageCost < 8000.

- in console, req.query be like,

{ averageCost: { lte: '8000' } }

- need to add to add dollar sign before lte, to do that

**controllers/bootcamp.js**

```javascript
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;
  // convert js object to json string.
  let queryStr = JSON.stringify(req.query);
  // gives,  {"averageCost":{"lte":"8000"}}

  // replace lte with $lte,
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // v concatenate with "$" with matched value,

  console.log(queryStr); // {"averageCost":{"$lte":"8000"}}

  // pass queryStr to query - parse it to js object
  query = Bootcamp.find(JSON.parse(queryStr));

  const bootcamps = await query;
  // get query params from api
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
```

- GET {{URL}}/api/v1/bootcamps?careers[in]=Mobile Development

- @desc: GET THE DOCUMENTS THAT CONTAINS A careers ARRAY HAVING 'Mobile Development' as value.
