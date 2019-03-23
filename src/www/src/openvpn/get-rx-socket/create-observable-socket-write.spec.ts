import { TimeoutError } from "rxjs";
import { createObservableSocketWrite } from "./create-observable-socket-write";

describe("createObservableSocketWrite()", () => {
  let socket: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    socket = mockSocket();
  });

  it("should call complete if socket is destroyed", (done) => {
    socket.destroyed = true;

    createObservableSocketWrite(socket)("command").subscribe({
      next: () => done.fail(),
      complete: () => done()
    });
  });

  it("should throw TimeoutError when data wasn't written out", (done) => {
    createObservableSocketWrite(socket)("command").subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(TimeoutError);
        done();
      }
    });
  });

  it("should call complete when an error occurs", (done) => {
    socket.write.mockImplementation(
      (cmd: string, enc: string, cb: (err: string) => void) => cb("Error")
    );

    createObservableSocketWrite(socket)("command").subscribe({
      next: () => done.fail(),
      complete: () => done()
    });
  });

  it("should call next when data was written out", (done) => {
    socket.write.mockImplementation(
      (cmd: string, enc: string, cb: (err: string, res: boolean) => void) =>
        cb(null, true)
    );

    createObservableSocketWrite(socket)("command").subscribe({
      next: (sent: boolean) => expect(sent).toBeTruthy(),
      complete: () => done()
    });
  });

  it("should add CRLF to end of the command", (done) => {
    socket.write.mockImplementation(
      (cmd: string, enc: string, cb: (err: string, res: boolean) => void) => {
        expect(cmd).toBe("command\r\n");
        cb(null, true);
        done();
      }
    );

    createObservableSocketWrite(socket)("command").subscribe();
  });
});

const mockSocket = () => ({
  write: jest.fn(),
  destroyed: false
});
