export class ResponseMock {
  body: unknown = {};
  statusCode: number | undefined;
  headersSent = false;

  status(code: number) {
    this.statusCode = code;

    return this;
  }

  json(body: unknown) {
    this.body = body;
  }
}
