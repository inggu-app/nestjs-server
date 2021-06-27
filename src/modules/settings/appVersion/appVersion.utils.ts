export function checkAppVersion(currentVersion: string, verifiableVersion: string): boolean {
  const lastVersionRelease = verifiableVersion.split('.').map(x => +x)
  const currentVersionRelease = currentVersion.split('.').map(x => +x)

  const isMajor = lastVersionRelease[0] > currentVersionRelease[0]
  const isMinor = lastVersionRelease[1] > currentVersionRelease[1]
  const isPatch = lastVersionRelease[2] > currentVersionRelease[2]

  if (isMajor) {
    return true
  }

  if (isMinor && lastVersionRelease[0] >= currentVersionRelease[0]) {
    return true
  }

  return (
    isPatch &&
    lastVersionRelease[0] >= currentVersionRelease[0] &&
    lastVersionRelease[1] >= currentVersionRelease[1]
  )
}
