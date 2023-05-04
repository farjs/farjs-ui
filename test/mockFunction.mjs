/**
 * @type { import('./mockFunction').default }
 */
function mockFunction(impl) {
  // @ts-ignore
  function mock(...args) {
    mock.times += 1;

    return impl ? impl.apply(undefined, args) : undefined;
  }

  mock.times = 0;
  return mock;
}

export default mockFunction;
