import { openVpn } from "./openvpn";
import { createConnection } from "net";
import { TimeoutError } from "rxjs";

jest.mock("net");

describe("openVpn", () => {
  let socket;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    socket = mockSocket();
    (<jest.Mock>createConnection).mockReturnValue(socket);
  });

  it("should have connect and destroy properties", () => {
    expect(openVpn()).toMatchSnapshot();
  });

  it("should be able to connect and emit commands", done => {
    socket.addEventListener.mockImplementation(
      (event, listener) => event === "connect" && listener()
    );

    openVpn()
      .connect("10.8.0.1", 5555)
      .subscribe({
        next: commands => {
          expect(createConnection).toHaveBeenCalledWith({
            host: "10.8.0.1",
            port: 5555
          });
          expect(commands).toMatchSnapshot();
        },
        complete: () => done()
      });
  });

  it("should handle error event correctly", done => {
    socket.addEventListener.mockImplementation(
      (event, listener) =>
        event === "error" && listener(new Error("Error happend"))
    );

    openVpn()
      .connect("10.8.0.1", 5555)
      .subscribe({
        error: error => {
          expect(error).toEqual(Error("Error happend"));
          done();
        }
      });
  });

  it("should handle tiemout error", done => {
    jest.useFakeTimers();

    openVpn()
      .connect("10.8.0.1", 5555)
      .subscribe({
        error: error => {
          expect(socket.destroy).toHaveBeenCalled();
          expect(error).toEqual(new TimeoutError());
          done();
        }
      });

    jest.advanceTimersByTime(3000);
    jest.useRealTimers();
  });
});

const mockSocket = () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  destroy: jest.fn()
});
