export function disassembleJwtData(token: string): Record<string, any> {
  if (!token) return { iss: null, exp: 0, platform: null, id: null };
  let tokenPayload = token.substring(token.indexOf(".") + 1);
  tokenPayload = tokenPayload.substring(0, tokenPayload.indexOf("."));
  return JSON.parse(atob(tokenPayload));
}
