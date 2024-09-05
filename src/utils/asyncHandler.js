const asyncHandler = (func) => {
  return (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch((error) => {
      next(error);
    });
  };
};

export default asyncHandler;

// const asyncHandler = (fun = (req, res, next) => {
//   try {
//     return fun(req, res, next);
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       massage: error.massage,
//     });
//   }
// });

// export default asyncHandler;
