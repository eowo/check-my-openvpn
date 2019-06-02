import { of, Subject } from "rxjs";
import { sendMsg } from "./send-msg";

jest.mock("../../get-rx-socket");

describe("sendMsg", () => {
  let read: any;
  let send: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
  });

  describe("send", () => {
    it(`should send "lorem ipsum"`, (done) => {
      send = jest.fn().mockReturnValue(of(true));

      sendMsg([read, send])("lorem ipsum").subscribe({
        complete: () => {
          expect(send).toHaveBeenCalledWith("lorem ipsum");
          done();
        }
      });
    });
  });
});
