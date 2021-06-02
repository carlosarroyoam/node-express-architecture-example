module.exports = ({ jsonwebtoken, stringUtils }) => (req, res, next) => {
  const accessToken = req.headers.authorization;

  if (!accessToken) {
    res.status(400).send({
      message: 'Bad request',
      error: 'No token authorization provided',
    });
    return;
  }

  try {
    jsonwebtoken.verify(accessToken);

    next();
  } catch (err) {
    res.status(401).send({ message: 'Unauthorized', error: stringUtils.capitalize(err.message) });
  }
};