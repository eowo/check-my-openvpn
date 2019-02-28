import * as React from "react";
import styled from "styled-components";
import { Subscription, Subject } from "rxjs";
import { scan, tap } from "rxjs/operators";

const Spinner = styled.div`
  color: black;
  display: inline-block;
`;

interface Props {}
interface State {
  frame: string;
}

export class Loading extends React.Component<Props, State> {
  static interval: number = 125;
  static frames: string[] = ["💻●∙∙🖥", "💻∙●∙🖥", "💻∙∙●🖥", "💻∙●∙🖥", "💻●∙∙🖥"];
  private frameSubject: Subject<number>;
  private subscription: Subscription;

  constructor(props: Props) {
    super(props);
    this.state = { frame: "" };
    this.frameSubject = new Subject();
    this.subscribeToFrameChange();
  }

  componentDidMount() {
    setInterval(() => this.frameSubject.next(1), Loading.interval);
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  subscribeToFrameChange() {
    this.subscription = this.frameSubject
      .pipe(
        scan(
          (acc: number) =>
            (acc = acc === Loading.frames.length - 1 ? 0 : ++acc),
          0
        ),
        tap(ix => this.setState({ frame: Loading.frames[ix] }))
      )
      .subscribe();
  }

  render() {
    return <Spinner>{this.state.frame}</Spinner>;
  }
}
