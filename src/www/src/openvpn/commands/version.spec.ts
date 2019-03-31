import { of, Subject } from "rxjs";
import { version } from "./version";

jest.mock("../get-rx-socket");

describe("version command", () => {
  let read: any;
  let send: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string[]>();
    send = jest.fn().mockReturnValue(of(true));
  });

  describe("send", () => {
    it(`should send "version" command`, (done) => {
      version([read, send]).subscribe({
        complete: () => {
          expect(send).toHaveBeenCalledWith("version");
          done();
        }
      });

      read.complete();
    });
  });

  describe("read", () => {
    it("should collect the message properly", (done) => {
      const MIXED_RESPONSE = [
        "OTHER_CMD_RESPONSE: ...\r",
        "END\r",
        "OpenVPN Version: OpenVPN 2.4.4\r",
        "Management Version: 1\r",
        "END\r"
      ];

      version([read, send]).subscribe({
        next: (response) => {
          expect(response).toEqual({
            "OpenVPN Version": "OpenVPN 2.4.4",
            "Management Version": "1"
          });
          done();
        }
      });

      MIXED_RESPONSE.map((row) => read.next(row));
    });
  });
});
