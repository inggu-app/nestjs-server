export function checkAppVersion(verifiableVersion: string, currentVersion: string): boolean {
  const verifiableVersionRelease = verifiableVersion.split('.').map(x => +x)
  const currentVersionRelease = currentVersion.split('.').map(x => +x)

  const isMajor = verifiableVersionRelease[0] > currentVersionRelease[0]
  const isMinor = verifiableVersionRelease[1] > currentVersionRelease[1]
  const isPatch = verifiableVersionRelease[2] > currentVersionRelease[2]

  if (isMajor) {
    return true
  }

  if (isMinor && verifiableVersionRelease[0] >= currentVersionRelease[0]) {
    return true
  }

  return isPatch && verifiableVersionRelease[0] >= currentVersionRelease[0] && verifiableVersionRelease[1] >= currentVersionRelease[1]
}
