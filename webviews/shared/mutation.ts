export const mutation = async (
    path: string,
    body: any,
    accessToken: string,
    { method }: { method: "POST" | "PUT" } = { method: "POST" }
  ) => {
    try {
      const r = await fetch(apiBaseUrl + path, {
        method,
        body: JSON.stringify(body),
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`
        },
      });
      if (r.status !== 200) {
        throw new Error(await r.text());
      }
      const _accessToken = r.headers.get('authorization');
      if (_accessToken) {
        accessToken = _accessToken;
        tsvscode.postMessage({
          type: "tokens",
          value: _accessToken,
        });
      }
      const d = await r.json();
      return d;
    } catch (err) {
      tsvscode.postMessage({
        type: "onError",
        value: err.message,
      });
      throw err;
    }
  };
  