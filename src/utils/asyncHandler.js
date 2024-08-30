const asyncHandler = (fun = async (req, res, next) => {
  try {
    await fun(req, res, next);
  } catch (error) {
    res.status(error.code || 500).json({
      success: false,
      massage: error.massage,
    });
  }
});

export { asyncHandler };

// const asyncHandler = (func) => {
//   (req, res, next) => {
//     Promise.resolve(func(req, res, next)).catch((error) => {
//       next(error);
//     });
//   };
// };
