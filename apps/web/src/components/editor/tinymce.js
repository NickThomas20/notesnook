import React, { useEffect } from "react";
import "tinymce/tinymce";
import "tinymce/icons/default";
import "tinymce/themes/silver";
import "tinymce/plugins/table";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/quickbars";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/lists";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/paste";
import "tinymce/plugins/importcss";
import "tinymce/plugins/hr";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/noneditable";
import "tinymce/plugins/table";
import "tinymce/plugins/directionality";
import "tinymce/plugins/media";
import "./plugins/code";
import "./plugins/shortlink";
import "./plugins/quickimage";
import "./plugins/checklist";
import "./editor.css";
import { Editor } from "@tinymce/tinymce-react";
import { isUserPremium } from "../../common";
import { showBuyDialog } from "../../common/dialog-controller";
import { useStore as useThemeStore } from "../../stores/theme-store";
import { isTablet } from "../../utils/dimensions";
import { KeyboardEventManager } from "../../utils/keyboard";

const markdownPatterns = [
  { start: "```", replacement: "<pre></pre>" },
  { start: "*", end: "*", format: "italic" },
  { start: "_", end: "_", format: "italic" },
  { start: "**", end: "**", format: "bold" },
  { start: "~~", end: "~~", format: "strikethrough" },
  { start: "`", end: "`", format: "code" },
  { start: "#", format: "h1" },
  { start: "##", format: "h2" },
  { start: "###", format: "h3" },
  { start: "####", format: "h4" },
  { start: "#####", format: "h5" },
  { start: "######", format: "h6" },
  { start: "* ", cmd: "InsertUnorderedList" },
  { start: "- ", cmd: "InsertUnorderedList" },
  { start: "> ", format: "blockquote" },
  {
    start: "1. ",
    cmd: "InsertOrderedList",
    value: { "list-style-type": "decimal" },
  },
  {
    start: "1) ",
    cmd: "InsertOrderedList",
    value: { "list-style-type": "decimal" },
  },
  {
    start: "a. ",
    cmd: "InsertOrderedList",
    value: { "list-style-type": "lower-alpha" },
  },
  {
    start: "a) ",
    cmd: "InsertOrderedList",
    value: { "list-style-type": "lower-alpha" },
  },
  {
    start: "i. ",
    cmd: "InsertOrderedList",
    value: { "list-style-type": "lower-roman" },
  },
  {
    start: "i) ",
    cmd: "InsertOrderedList",
    value: { "list-style-type": "lower-roman" },
  },
  { start: "---", replacement: "<hr/>" },
  { start: "--", replacement: "—" },
  { start: "(c)", replacement: "©" },
];

const premiumCommands = [
  "InsertUnorderedList",
  "InsertOrderedList",
  "indent",
  "JustifyFull",
  "JustifyLeft",
  "JustifyRight",
  "JustifyCenter",
  "FontSize",
  "mceApplyTextcolor",
  "mceInsertContent",
  "mceMedia",
  "mceDirectionRTL",
];

function useSkin() {
  const theme = useThemeStore((store) => store.theme);
  const host = window.location.origin;
  return theme === "dark"
    ? [host + "/skins/notesnook", host + "/skins/notesnook-dark"]
    : [host + "/skins/notesnook-dark", host + "/skins/notesnook"];
}

function TinyMCE(props) {
  const {
    changeInterval,
    onChange,
    onWordCountChanged,
    onSave,
    placeholder,
    simple,
    initialValue,
    onFocus,
    editorRef,
    onInit,
  } = props;
  const [oldSkin, newSkin] = useSkin();
  const tinymceRef = editorRef;
  useEffect(() => {
    tinymceRef.current.editor.dom.styleSheetLoader.unload(
      `${oldSkin}/content.inline.min.css`
    );
    tinymceRef.current.editor.ui.styleSheetLoader.unload(
      `${oldSkin}/skin.min.css`
    );
    tinymceRef.current.editor.dom.styleSheetLoader.load(
      `${newSkin}/content.inline.min.css`
    );
    tinymceRef.current.editor.ui.styleSheetLoader.load(
      `${newSkin}/skin.min.css`
    );
  }, [tinymceRef, newSkin, oldSkin]);

  return (
    <Editor
      ref={tinymceRef}
      onFocus={onFocus}
      onInit={onInit}
      initialValue={initialValue}
      init={{
        menubar: false,
        statusbar: false,
        link_quicklink: true,
        width: "100%",
        plugins:
          "checklist paste importcss searchreplace autolink directionality code quickimage shortlink media table hr advlist lists imagetools textpattern noneditable quickbars autoresize",
        toolbar_mode: isTablet() ? "scrolling" : "sliding",
        contextmenu: false,
        quickbars_insert_toolbar: false,
        skin_url: newSkin,
        // content_css: "",
        content_style: `
        pre.codeblock {
          overflow-x: auto;
        }

        img {
          max-width:100% !important;
          height:auto !important;
        }
        
        iframe {
          max-width:100% !important;
        }

        table {
          display: block !important;
          overflow-x: auto !important;
          white-space: nowrap  !important;
          max-width:100% !important;
          width:100% !important;
          height:auto !important;
        }
        
        td {
          min-width:20vw !important;
        }
`,
        toolbar: simple
          ? false
          : `bold italic underline strikethrough blockquote code | fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor removeformat | hr | image media link table | ltr rtl | searchreplace`,
        quickbars_selection_toolbar:
          "bold italic underline strikethrough code h2 h3 quicklink blockquote",
        mobile: {
          toolbar_mode: "scrolling",
        },
        block_formats:
          "Paragraph=p; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5; Header 6=h6; Code=pre",
        textpattern_patterns: markdownPatterns,
        placeholder: placeholder || "Start writing your note here...",
        target_list: false,
        link_title: false,
        imagetools_toolbar: "rotateleft rotateright | flipv fliph",
        setup: (editor) => {
          editor.on("ScrollIntoView", (e) => {
            e.preventDefault();
            e.elm.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
          });
        },
        toolbar_persist: true,
        toolbar_sticky: false,
        browser_spellcheck: true,
        inline: true,
        fixed_toolbar_container: "#editorToolbar",
        autoresize_bottom_margin: 100,
      }}
      onBeforeExecCommand={async (command) => {
        if (
          premiumCommands.some(
            (cmd) => command.command === cmd && !command?.value?.paste
          ) &&
          !isUserPremium()
        ) {
          command.preventDefault();
          await showBuyDialog("editor");
          return;
        }
      }}
      onKeyDown={(e) => {
        e.getModifierState = undefined;
        KeyboardEventManager.publish("keydown", e);
        if (e.ctrlKey && e.key === "s") {
          e.preventDefault();
          onSave();
        }
      }}
      onKeyUp={(e) => {
        e.getModifierState = undefined;
        KeyboardEventManager.publish("keyup", e);
      }}
      onEditorChange={(content, editor) => {
        if (onWordCountChanged) {
          const text = editor.getContent({
            format: "text",
            no_events: true,
            get: true,
            content,
          });
          onWordCountChanged(countWords(text));
        }

        if (editor.isLoading) {
          editor.isLoading = false;
          return;
        }

        clearTimeout(editor.changeTimeout);
        editor.changeTimeout = setTimeout(
          () => onChange(content, editor),
          changeInterval
        );
      }}
    />
  );
}

export default React.memo(TinyMCE, () => true);

function countWords(str) {
  let count = 0;
  let shouldCount = false;

  for (var i = 0; i < str.length; ++i) {
    const s = str[i];

    if (s === " " || s === "\r" || s === "\n" || s === "*") {
      if (!shouldCount) continue;
      ++count;
      shouldCount = false;
    } else {
      shouldCount = true;
    }
  }

  if (shouldCount) ++count;
  return count;
}