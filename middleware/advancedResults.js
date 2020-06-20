const advancedResult = (model, populate) => async (req, res, next) => {
    let query;
    //make a copy of req.query
    const reqQuery = {
        ...req.query,
    };

    // convert js object to json string.
    let queryStr = JSON.stringify(reqQuery);
    // gives,  {"averageCost":{"lte":"8000"}}

    // replace lte with $lte,
    queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
    );
    // v concatenate with $ with matched value,

    // console.log(queryStr); // {"averageCost":{"$lte":"8000"}}

    // pass queryStr to query - parse it to js object 
    query = model.find(JSON.parse(queryStr));

    // if there is something to populate
    if (populate) {
        query = query.populate(populate);
    }

    // executing the query
    const results = await query;

    // send back the response
    res.advancedResult = {
        success: true,
        count: results.length,
        data: results,
    };

    //   move to next middleare
    next();
};

// export the function
module.exports = advancedResult;