import { ResponseMock } from "../test-utils/response.mock";
import { errorHandler } from "./errorHandler";

const nextMock = vi.fn();
const requestMock = <any>{ headers: {} };

describe("Error handler tests", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "test";
  });

  it("should call next when response has already been sent", () => {
    errorHandler(<any>{}, requestMock, <any>{ headersSent: true }, nextMock);

    expect(nextMock).toHaveBeenCalledTimes(1);
  });

  it("should return 500 in production", () => {
    const responseMock = new ResponseMock();

    process.env.NODE_ENV = "production";
    errorHandler(new Error("Prod"), requestMock, <any>responseMock, nextMock);

    expect(responseMock.body).toEqual({ message: "Internal Server Error" });
    expect(nextMock).toHaveBeenCalledTimes(0);
  });

  it("should return 500 in tests", () => {
    const responseMock = new ResponseMock();

    errorHandler(new Error("Test"), requestMock, <any>responseMock, nextMock);

    expect(responseMock.body).toEqual({ message: "Internal Server Error" });
    expect(nextMock).toHaveBeenCalledTimes(0);
  });

  it("should return the error in not production or test env", () => {
    const err = new Error("Dev");
    const responseMock = new ResponseMock();

    process.env.NODE_ENV = "dev";
    errorHandler(err, requestMock, <any>responseMock, nextMock);

    expect(responseMock.body).toEqual(err);
    expect(nextMock).toHaveBeenCalledTimes(0);
  });
});
