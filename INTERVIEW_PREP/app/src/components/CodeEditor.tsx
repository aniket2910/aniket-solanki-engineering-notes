import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import { useMemo } from "react";
import { useIsDark } from "../lib/theme.ts";

type Props = {
  value: string;
  onChange?: (v: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  minHeight?: string;
};

export function CodeEditor({ value, onChange, onRun, readOnly = false, minHeight = "260px" }: Props) {
  const dark = useIsDark();
  const extensions = useMemo(
    () => [
      javascript({ typescript: true }),
      Prec.highest(
        keymap.of([
          {
            key: "Mod-Enter",
            run: () => {
              onRun?.();
              return true;
            },
          },
        ]),
      ),
    ],
    [onRun],
  );
  return (
    <CodeMirror
      className="editor"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      editable={!readOnly}
      theme={dark ? "dark" : "light"}
      minHeight={minHeight}
      extensions={extensions}
      basicSetup={{ foldGutter: false, highlightActiveLine: !readOnly }}
    />
  );
}
