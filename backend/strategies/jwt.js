// https://medium.com/@paul.allies/stateless-auth-with-express-passport-jwt-7a55ffae0a5c

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET_KEY;

module.exports = new JwtStrategy(opts, (jwt_payload, done) => {
  if (jwt_payload.username === "Barry Sweeney") {
    return done(null, true);
  }
  return done(null, false);
});
