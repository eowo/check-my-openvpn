import { take } from "rxjs/operators";
import { createObservableSocketRead } from "./create-observable-socket-read";

describe("createObservableSocketRead()", () => {
  let socket: any;
  const listeners: {
    data: (data: Buffer) => void;
    error: (error: Error) => void;
    close: (hadError: boolean) => void;
  } = {
    data: undefined,
    error: undefined,
    close: undefined
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    socket = mockSocket(listeners);
  });

  it("should call complete if socket was closed", (done) => {
    createObservableSocketRead(socket).subscribe({
      complete: () => done()
    });

    listeners.close(false);
  });

  it("should call error if socket was closed due to a transmission error", (done) => {
    createObservableSocketRead(socket).subscribe({
      error: (error) => {
        expect(error).toBe("Socket was closed due to a transmission error");
        done();
      }
    });

    listeners.close(true);
  });

  it("should call error when an error occurs", (done) => {
    createObservableSocketRead(socket).subscribe({
      error: (error) => {
        expect(error).toEqual(new Error("error"));
        done();
      }
    });

    listeners.error(new Error("error"));
  });

  it("should collect packages", (done) => {
    const packages: Buffer[] = [
      Buffer.from("F"),
      Buffer.from("o"),
      Buffer.from("o\r\n"),
      Buffer.from("B"),
      Buffer.from("a"),
      Buffer.from("r\r\n")
    ];
    const res: string[] = [];

    createObservableSocketRead(socket)
      .pipe(take(2))
      .subscribe({
        next: (data: string) => res.push(data),
        complete: () => {
          expect(res).toEqual(["Foo\r", "Bar\r"]);
          done();
        }
      });

    packages.map((p) => listeners.data(p));
  });
});

const mockSocket = (listeners: {
  [event: string]: (...args: [any]) => void;
}) => ({
  addEventListener: jest
    .fn()
    .mockImplementation(
      (event: string, listener: (...args: [any]) => void) =>
        (listeners[event] = listener)
    ),
  removeEventListener: jest.fn()
});
