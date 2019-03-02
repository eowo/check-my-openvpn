import { createConnection } from "net";
import { TimeoutError } from "rxjs";
import { openVpn } from "./openvpn";

jest.mock("net");

describe("openVpn", () => {
  let socket: any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    socket = mockSocket();
    (createConnection as jest.Mock).mockReturnValue(socket);
  });

  it("should have connect and destroy properties", () => {
    expect(openVpn()).toMatchSnapshot();
  });

  describe("connect()", () => {
    it("should be able to connect and emit commands", (done) => {
      socket.addEventListener.mockImplementation(
        (event: string, listener: () => void) =>
          event === "connect" && listener()
      );

      openVpn()
        .connect("10.8.0.1", 5555)
        .subscribe({
          next: (commands) => {
            expect(createConnection).toHaveBeenCalledWith({
              host: "10.8.0.1",
              port: 5555
            });
            expect(commands).toMatchSnapshot();
          },
          complete: () => done()
        });
    });

    it("should handle error event correctly", (done) => {
      socket.addEventListener.mockImplementation(
        (event: string, listener: (error: Error) => void) =>
          event === "error" && listener(new Error("Error happend"))
      );

      openVpn()
        .connect("10.8.0.1", 5555)
        .subscribe({
          error: (error) => {
            expect(error).toEqual(Error("Error happend"));
            done();
          }
        });
    });

    it("should handle tiemout error", (done) => {
      jest.useFakeTimers();

      openVpn()
        .connect("10.8.0.1", 5555)
        .subscribe({
          error: (error) => {
            expect(socket.destroy).toHaveBeenCalled();
            expect(error).toEqual(new TimeoutError());
            done();
          }
        });

      jest.advanceTimersByTime(3000);
      jest.useRealTimers();
    });
  });

  describe("disconnect()", () => {
    it("should call socket.end()", (done) => {
      socket.addEventListener.mockImplementation(
        (event: string, listener: () => void) =>
          event === "connect" && listener()
      );
      socket.end.mockImplementation(() => done());

      const o = openVpn();
      o.connect("10.8.0.1", 5555).subscribe({ complete: () => o.disconnect() });
    });
  });
});

const mockSocket = () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  destroy: jest.fn(),
  end: jest.fn()
});
