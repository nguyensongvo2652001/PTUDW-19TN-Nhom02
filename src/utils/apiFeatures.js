module.exports = class APIFeatures {
  constructor(queryObj, query) {
    this.queryObj = queryObj;
    this.query = query;
  }

  filter() {
    const newQuery = { ...this.query };

    const excludedFields = ["sort", "fields", "page", "limit"];
    excludedFields.forEach((field) => delete newQuery[field]);

    const queryStr = JSON.stringify(newQuery).replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.queryObj = this.queryObj.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortBy = this.query.sort.split(",").join(" ");
      this.queryObj = this.queryObj.sort(sortBy);
    } else {
      this.queryObj = this.queryObj.sort("-dateAdded");
    }
    return this;
  }

  limitFields() {
    if (this.query.fields) {
      const fields = this.query.fields.split(",").join(" ");
      this.queryObj = this.queryObj.select(fields);
    } else {
      this.queryObj = this.queryObj.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;
    this.queryObj = this.queryObj.skip(skip).limit(limit);

    return this;
  }
};
