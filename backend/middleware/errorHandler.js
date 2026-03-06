const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  console.error(err.stack);

  const bn = (req.body?.language || req.query?.language || 'bn') === 'bn';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: bn ? 'যাচাইকরণ ত্রুটি' : 'Validation Error',
      message: err.message,
    });
  }

  if (err.response?.status === 429) {
    return res.status(429).json({
      error: bn ? 'অনুরোধ সীমা অতিক্রান্ত' : 'Rate Limited',
      message: bn ? 'এআই সেবায় অনেক বেশি অনুরোধ। অনুগ্রহ করে কিছুক্ষণ পরে আবার চেষ্টা করুন।' : 'Too many requests to AI service. Please try again later.',
    });
  }

  res.status(err.status || 500).json({
    error: bn ? 'সার্ভার ত্রুটি' : 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? (bn ? 'কিছু ভুল হয়েছে' : 'Something went wrong')
      : err.message,
  });
};

module.exports = errorHandler;
