import { Subject } from "rxjs";
import { info } from "./info";

jest.mock("../../get-rx-socket");

describe("Real-time notification: info", () => {
  let read: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  it("should collect the message properly", (done) => {
    info([read]).subscribe({
      next: (response) => {
        expect(response).toBe(">INFO: info message\r");
        done();
      }
    });

    read.next(">INFO: info message\r");
  });
});
