const safeEquals = (left, right) => {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
};

const getAdminKeyFromRequest = (req) => {
  const headerKey = req.header("x-admin-key");

  if (headerKey) {
    return String(headerKey).trim();
  }

  const authHeader = req.header("authorization") || "";
  if (authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return "";
};

const getConfiguredAdminKey = () => (process.env.ADMIN_ACCESS_KEY || "admin123").trim();

export const validateAdminAccess = (req, res, next) => {
  const providedKey = getAdminKeyFromRequest(req);
  const configuredKey = getConfiguredAdminKey();

  if (!providedKey || !safeEquals(providedKey, configuredKey)) {
    res.status(401);
    throw new Error("Admin access denied. Invalid credentials.");
  }

  next();
};

export const verifyAdminAccessKey = (accessKey) => {
  const configuredKey = getConfiguredAdminKey();
  return Boolean(accessKey) && safeEquals(String(accessKey).trim(), configuredKey);
};
