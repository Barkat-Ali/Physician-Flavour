const buildHeaderReader = (headers = {}) => {
  const normalized = Object.entries(headers).reduce((acc, [key, value]) => {
    acc[String(key).toLowerCase()] = value;
    return acc;
  }, {});

  return (name) => normalized[String(name).toLowerCase()] || "";
};

export const buildRequest = ({ req, query = {}, params = {}, body = {} }) => ({
  ...req,
  query,
  params,
  body,
  header: buildHeaderReader(req.headers)
});

const sendError = (error, res) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  if (!res.headersSent) {
    res.status(statusCode).json({
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? null : error.stack
    });
  }
};

export const runController = async ({ controller, req, res }) => {
  await new Promise((resolve) => {
    const next = (error) => {
      if (error) {
        sendError(error, res);
      }
      resolve();
    };

    Promise.resolve(controller(req, res, next))
      .then(() => resolve())
      .catch((error) => next(error));
  });
};

export const runMiddleware = async ({ middleware, req, res }) => {
  let didPass = false;

  const next = () => {
    didPass = true;
  };

  try {
    await Promise.resolve(middleware(req, res, next));
  } catch (error) {
    sendError(error, res);
    return false;
  }

  return didPass;
};
