import * as React from "react";
import { forkJoin, Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";
import CommandsContext from "../commands-context";
import { P, V, Wrapper } from "./openvpn.style";

interface State {
  pid: string;
  version: { [key: string]: string };
}

export class OpenVPN extends React.Component<{}, State> {
  public static contextType = CommandsContext;
  public context!: React.ContextType<typeof CommandsContext>;
  private subscription: Subscription = undefined;

  constructor(props: {}) {
    super(props);
    this.state = { pid: "", version: {} };
  }

  public componentDidMount() {
    const { commandsSource } = this.context;
    this.subscription = commandsSource
      .pipe(switchMap(({ pid, version }) => forkJoin(pid, version)))
      .subscribe(([pid, version]) => this.setState({ pid, version }));
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public render() {
    return (
      <Wrapper>
        <P>Process ID:</P>
        <V>{this.state.pid}</V>
        {Object.entries(this.state.version).map(([key, value]) => (
          <React.Fragment key={key}>
            <P>{key}:</P>
            <V>{value}</V>
          </React.Fragment>
        ))}
      </Wrapper>
    );
  }
}
