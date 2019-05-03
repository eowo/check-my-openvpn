import { Subject } from "rxjs";
import { log } from "./log";

jest.mock("../../get-rx-socket");

describe("Real-time notification: log", () => {
  let read: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  it("should collect the message properly", (done) => {
    log([read]).subscribe({
      next: (response) => {
        expect(response).toEqual({
          time: "2019-04-29T20:28:44.000Z",
          flag: "I",
          message: "x:y,z"
        });
        done();
      }
    });

    read.next(">LOG:1556569724,I,x:y,z\r");
  });

  it("should catch the error", (done) => {
    log([read]).subscribe({
      next: () => {
        done.fail("should not be called");
      },
      complete: () => done()
    });

    read.error(new Error("error"));
    read.next(">LOG: message\r");
  });
});
