/**
 * @typedef {import("./AppRoot").MainUi} MainUi
 * @typedef {import("./AppRoot").LoadResult} LoadResult
 * @typedef {import("./AppRoot").AppRootProps} AppRootProps
 * @typedef {import("../theme/Theme").ThemeType} ThemeType
 * @typedef {import("@farjs/blessed").Widgets.BlessedElement} BlessedElement
 * @typedef {import("@farjs/blessed").Widgets.Events.IKeyEventArg & {
 *    defaultPrevented?: boolean
 * }} IKeyEventArg
 */
import React, { useLayoutEffect, useReducer, useRef, useState } from "react";
import Theme from "../theme/Theme.mjs";
import DevTool from "../tool/DevTool.mjs";
import DevToolPanel from "../tool/DevToolPanel.mjs";
import LogController from "../tool/LogController.mjs";
import TaskReducer from "../task/TaskReducer.mjs";
import TaskManager from "../task/TaskManager.mjs";

const h = React.createElement;

/**
 * @param {AppRootProps} props
 */
const AppRoot = (props) => {
  const { taskControllerComp, logControllerComp, devToolPanelComp } = AppRoot;

  /** @type {[MainUi | undefined, React.Dispatch<React.SetStateAction<MainUi | undefined>>]} */
  const [mainUi, setMainUi] = useState();
  const elementRef = /** @type {React.MutableRefObject<BlessedElement>} */ (
    useRef()
  );
  const [devTool, setDevTool] = useState(props.initialDevTool);
  const [currTheme, setCurrTheme] = useState(props.defaultTheme);
  const [state, dispatch] = useReducer(TaskReducer, undefined);

  useLayoutEffect(() => {
    const screen = elementRef.current.screen;
    /** @type {(ch: any, key: IKeyEventArg) => void} */
    const keyListener = (_, key) => {
      if (key.full === "f12") {
        setDevTool((from) => {
          const to = DevTool.getNext(from);
          if (DevTool.shouldResize(from, to)) {
            //exec on the next tick
            Promise.resolve().then(() => {
              screen.program.emit("resize");
            });
          }
          return to;
        });
      }
    };
    screen.on("keypress", keyListener);

    return () => {
      screen.off("keypress", keyListener);
    };
  }, []);

  return h(
    Theme.Context.Provider,
    { value: currTheme },
    h(
      "box",
      {
        ref: elementRef,
        width: devTool === DevTool.Hidden ? "100%" : "70%",
      },
      mainUi
        ? h(mainUi, null, h(taskControllerComp, { startTask: state }))
        : h("text", null, "Loading...")
    ),

    h(logControllerComp, {
      onReady: () => {
        props
          .loadMainUi(dispatch)
          .then((loadRes) => {
            setCurrTheme(loadRes.theme);
            setMainUi(() => loadRes.mainUi);
          })
          .catch((error) => {
            console.error(error);
          });
      },
      render: (content) => {
        return devTool !== DevTool.Hidden
          ? h(
              "box",
              { width: "30%", height: "100%", left: "70%" },
              h(devToolPanelComp, {
                devTool,
                logContent: content,
                onActivate: setDevTool,
              })
            )
          : null;
      },
    })
  );
};

AppRoot.displayName = "AppRoot";
AppRoot.taskControllerComp = TaskManager;
AppRoot.logControllerComp = LogController;
AppRoot.devToolPanelComp = DevToolPanel;

export default AppRoot;
