
/**
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginApi} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onPostLogin = async (event, api) => {
  console.log('invoke onPostLogin: ', event);

  api.user.setUserMetadata('foo', 'bar');

  const token = api.redirect.encodeToken({
    secret: event.secrets.MY_REDIRECT_SECRET,
    payload: {
      foo: 'foo',
      bar: 'bar',
    }
  });

  api.redirect.sendUserTo('http://www.foo.com', {
    query: { session_token: token }
  });
}

exports.onContinuePostLogin = async (event, api) => {
  const payload = await api.redirect.validateToken({
    secret: event.secrets.MY_REDIRECT_SECRET,
    tokenParamName: 'session_token',
  });
  console.log('onContinuePostLogin: ', payload);

  api.idToken.setCustomClaim('foo', payload.foo);
};
