export type TokenExchangeFn = (
  code: string,
  cb: (err: Error, token: string) => void,
) => void;

export type FetchUserProfileFn = (
  accessToken: string,
  ctx: any,
  cb: (err: Error, profile: any) => void,
) => void;
