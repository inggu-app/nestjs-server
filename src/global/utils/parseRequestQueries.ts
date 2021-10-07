export const parseRequestQueries = <T extends string>(names: T[], url: string) => {
  const queries = {} as { [key in T]: string | null }

  names.forEach(name => (queries[name] = getParameterByName(name, url)))

  return queries
}

function getParameterByName(name: string, url: string) {
  name = name.replace(/[\[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}
