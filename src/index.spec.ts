import { Db, Scanner } from "@miikaah/musa-core";

import { app } from "./api";
import { errorHandler } from "./error-handler";
import { start } from ".";

jest.mock("musa-core");
(Scanner.init as jest.MockedFunction<typeof Scanner.init>).mockResolvedValue(<any>{});

jest.mock("./api");

describe("Index tests", () => {
  process.env.FORCE_SERVER_START = "yes";

  beforeAll(start);

  it("should start server", async () => {
    await (app.listen as jest.Mock).mock.calls[0][1]();

    expect(app.use).toHaveBeenCalledWith(errorHandler);
    expect(Db.init).toHaveBeenCalledWith(process.cwd());
    expect(Scanner.init).toHaveBeenCalledWith({
      baseUrl: expect.any(String),
      isElectron: false,
      musicLibraryPath: expect.any(String),
    });
    expect(app.listen).toHaveBeenCalledWith(4200, expect.any(Function));
    expect(Scanner.update).toHaveBeenCalledTimes(1);
  });
});
