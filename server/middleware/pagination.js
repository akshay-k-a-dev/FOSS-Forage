const paginate = (model) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    // Ensure reasonable limits
    const maxLimit = 100;
    const finalLimit = limit > maxLimit ? maxLimit : limit;

    req.pagination = {
      page,
      limit: finalLimit,
      skip
    };

    next();
  };
};

module.exports = { paginate };