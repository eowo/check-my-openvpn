import { Subject } from "rxjs";
import { managementPassword, STATES } from "./management-password";

jest.mock("../../get-rx-socket");

describe("managementPassword", () => {
  let read: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    read = new Subject<string>();
  });

  it("should get STATES.REQUEST", (done) => {
    managementPassword([read]).subscribe({
      next: (state) => {
        expect(state).toBe(STATES.REQUEST);
        done();
      }
    });

    read.next("ENTER PASSWORD:");
  });

  it("should get STATES.SUCCESS", (done) => {
    managementPassword([read]).subscribe({
      next: (state) => {
        expect(state).toBe(STATES.SUCCESS);
        done();
      }
    });

    read.next("SUCCESS: password is correct\r");
  });
});
