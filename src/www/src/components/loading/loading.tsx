import * as React from "react";
import { Subject, Subscription } from "rxjs";
import { scan, tap } from "rxjs/operators";
import styled from "styled-components";

const Spinner = styled.div`
  color: whitesmoke;
  display: inline-block;
  padding: 10px;
  font-size: 1.2em;
`;

interface State {
  frame: string;
}

export class Loading extends React.Component<{}, State> {
  public static interval: number = 125;
  public static frames: string[] = [
    "💻●∙∙🖥",
    "💻∙●∙🖥",
    "💻∙∙●🖥",
    "💻∙●∙🖥",
    "💻●∙∙🖥"
  ];
  private frameSubject: Subject<number>;
  private subscription: Subscription;

  constructor(props: {}) {
    super(props);
    this.state = { frame: "" };
    this.frameSubject = new Subject();
    this.subscribeToFrameChange();
  }

  public componentDidMount() {
    setInterval(() => this.frameSubject.next(1), Loading.interval);
  }

  public componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  public subscribeToFrameChange() {
    this.subscription = this.frameSubject
      .pipe(
        scan(
          (acc: number) =>
            (acc = acc === Loading.frames.length - 1 ? 0 : ++acc),
          0
        ),
        tap((ix) => this.setState({ frame: Loading.frames[ix] }))
      )
      .subscribe();
  }

  public render() {
    return <Spinner>{this.state.frame}</Spinner>;
  }
}
