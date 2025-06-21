const pagination = (model) => {
  return async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
      const total = await model.countDocuments(req.query.filter || {});
      
      req.pagination = {
        page,
        limit,
        skip,
        total,
        pages: Math.ceil(total / limit)
      };

      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};

module.exports = pagination;