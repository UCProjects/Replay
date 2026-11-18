const IP_ADDRESS = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;

export function isAuthorizedHost(hostname: string, domains: string[]): boolean {
  return domains.some((domain) => {
    if (IP_ADDRESS.test(domain)) return hostname === domain;
    const escaped = domain.replace(/\./g, '\\.');
    return new RegExp(`^(.+\\.${escaped}|${escaped})$`, 'i').test(hostname);
  });
}
