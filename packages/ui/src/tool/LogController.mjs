/**
 * @typedef {import("./LogController").LogControllerProps} LogControllerProps
 */
import { useRef, useState, useLayoutEffect } from "react";

/**
 * @param {LogControllerProps} props
 */
const LogController = (props) => {
  const { maxBufferLength } = LogController;
  const [content, setContent] = useState("");
  const oldLogRef = useRef(null);
  const oldErrorRef = useRef(null);

  useLayoutEffect(() => {
    // @ts-ignore
    oldLogRef.current = console.log;
    // @ts-ignore
    oldErrorRef.current = console.error;

    /**
     * @param {string} msg
     */
    const log = (msg) => {
      setContent((c) => {
        const buf = `${c}${msg}\n`;
        if (buf.length > maxBufferLength) {
          const cutAt = buf.indexOf("\n", buf.length - maxBufferLength);
          return buf.substring(cutAt + 1);
        }
        return buf;
      });
    };
    console.log = log;
    console.error = log;

    props.onReady();

    return () => {
      // @ts-ignore
      console.log = oldLogRef.current;
      // @ts-ignore
      console.error = oldErrorRef.current;
    };
  }, []);

  return props.render(content);
};

LogController.displayName = "LogController";
LogController.maxBufferLength = 64 * 1024;

export default LogController;
