export const parseUrlPathname = (url: URL) => {
  // api/users/11
  const urlPaths = url.pathname.split('/')
    .filter(path => path !== '')

  // [ 'api', 'users', '11' ]
  return urlPaths
}
